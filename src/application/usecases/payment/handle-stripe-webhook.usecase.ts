import { IHandleStripeWebhookUseCase } from '@application/interfaces/payment/payment.usecase.interface';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { IPaymentRepository } from '@core/interfaces/repository/payment-repository.interface';
import { IPropertyRepository } from '@core/interfaces/repository/property-repository.interface';
import { ICreateNotificationUsecase } from '@application/interfaces/notification/notification.usecase.interface';
import { IStripeService } from '@application/interfaces/services/stripe.service.interface';
import { PaymentEntity } from '@core/entities/payment.entity';
import { AgreementStatus } from '@core/types/agreement.types';
import { PaymentCategory, PaymentStatus } from '@core/types/payment.types';

import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import { logger } from '@shared/log/logger';
import { NotificationType } from '@shared/enums/notification-type.enum';
import type { StripeCheckoutSession } from '@shared/types/stripe.types';
import { v4 as uuidv4 } from 'uuid';
@injectable()
export class HandleStripeWebhookUseCase implements IHandleStripeWebhookUseCase {
    constructor(
        @inject(TokenTypes.IStripeService) private _stripeService: IStripeService,
        @inject(TokenTypes.IPaymentRepository) private _paymentRepository: IPaymentRepository,
        @inject(TokenTypes.IAgreementRepository)
        private _agreementRepository: IAgreementRepository,
        @inject(TokenTypes.IPropertyRepository) private _propertyRepository: IPropertyRepository,
        @inject(TokenTypes.ICreateNotificationUseCase)
        private _createNotification: ICreateNotificationUsecase,
    ) {}

    async execute(payload: Buffer, signature: string): Promise<void> {
        const event = this._stripeService.constructWebhookEvent(payload, signature);

        if (event.type === 'checkout.session.completed') {
            await this.handleCheckoutCompleted(event.data.object as StripeCheckoutSession);
            return;
        }

        if (event.type === 'checkout.session.expired') {
            logger.info({ eventId: event.id }, 'Stripe checkout session expired');
        }
    }

    private async handleCheckoutCompleted(session: StripeCheckoutSession): Promise<void> {
        const paymentId = session.metadata?.paymentId;
        if (!paymentId) {
            logger.warn({ sessionId: session.id }, 'Checkout session missing paymentId metadata');
            return;
        }

        const payment = await this._paymentRepository.findById(paymentId);
        if (!payment) {
            logger.warn({ paymentId }, 'Payment not found for checkout session');
            return;
        }

        if (payment.status === PaymentStatus.PAID) {
            return;
        }

        const gatewayPaymentId =
            typeof session.payment_intent === 'string'
                ? session.payment_intent
                : session.payment_intent?.id;

        if (!gatewayPaymentId) {
            logger.warn({ paymentId }, 'Checkout session missing payment_intent');
            return;
        }

        payment.markPaid('stripe', 'card', gatewayPaymentId, session.id);
        await this._paymentRepository.update(payment);

        if (payment.category === PaymentCategory.RENT) {
            return;
        }

        if (payment.category !== PaymentCategory.SECURITY_DEPOSIT) {
            return;
        }

        const agreement = await this._agreementRepository.findById(payment.agreementId);
        if (!agreement) {
            return;
        }

        if (agreement.status !== AgreementStatus.PENDING_PAYMENT) {
            return;
        }

        agreement.markDepositPaid();
        agreement.readyForTenantSignature();
        await this._agreementRepository.update(agreement);

        const property = await this._propertyRepository.findById(agreement.propertyId);
        if (property) {
            property.markAsRented();
            await this._propertyRepository.update(property);
        }

        // Create first month's rent payment (idempotent — skip if one already exists)
        const firstRentDueDate = new Date(agreement.startDate);
        firstRentDueDate.setMonth(firstRentDueDate.getMonth() + 1);

        const existingPayments = await this._paymentRepository.findByAgreementId(agreement.id);
        const firstRentAlreadyExists = existingPayments.some(
            (p) =>
                p.category === PaymentCategory.RENT &&
                p.dueDate &&
                p.dueDate.getTime() === firstRentDueDate.getTime(),
        );

        if (firstRentAlreadyExists) {
            logger.info(
                { agreementId: agreement.id },
                'First rent payment already exists, skipping creation',
            );
            return;
        }

        const firstRentPayment = PaymentEntity.create({
            id: uuidv4(),
            transactionId: undefined,
            agreementId: agreement.id,
            propertyId: agreement.propertyId,
            payerId: agreement.tenantId,
            payeeId: agreement.ownerId,
            amount: agreement.monthlyRent,
            category: PaymentCategory.RENT,
            dueDate: firstRentDueDate,
            paidDate: undefined,
            paymentGateway: undefined,
            paymentMethod: undefined,
            status: PaymentStatus.PENDING,
            lateFeeApplied: 0,
            daysLate: 0,
            gatewayOrderId: undefined,
            gatewayPaymentId: undefined,
            failureReason: undefined,
            receiptUrl: undefined,
            isRefunded: false,
            refundAmount: undefined,
            refundDate: undefined,
            refundReason: undefined,
            gatewayRefundId: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const createdRentPayment = await this._paymentRepository.create(firstRentPayment);

        try {
            await this._createNotification.execute({
                userId: agreement.tenantId,
                notificationType: NotificationType.AGREEMENT_ACTIVATED,
                title: 'Deposit Received - Please Sign',
                message: `Your deposit for agreement (No. ${agreement.agreementNumber}) was received. Please sign the agreement and upload KYC to activate it.`,
                actionUrl: `/agreements/${agreement.id}`,
                relatedEntityType: 'Agreement',
                relatedEntityId: agreement.id,
                notificationData: { agreementNumber: agreement.agreementNumber },
            });

            await this._createNotification.execute({
                userId: agreement.ownerId,
                notificationType: NotificationType.PAYMENT_RECEIVED,
                title: 'Deposit Received',
                message: `Security deposit received for agreement No. ${agreement.agreementNumber}.`,
                actionUrl: `/agreements/${agreement.id}`,
                relatedEntityType: 'Payment',
                relatedEntityId: payment.id,
                notificationData: {
                    agreementNumber: agreement.agreementNumber,
                    amount: payment.amount,
                },
            });

            await this._createNotification.execute({
                userId: agreement.tenantId,
                notificationType: NotificationType.PAYMENT_DUE,
                title: 'First Rent Payment Due',
                message: `Your first rent payment of ₹${agreement.monthlyRent.toLocaleString()} is due on ${firstRentDueDate.toLocaleDateString()}.`,
                actionUrl: `/payments/${createdRentPayment.id}`,
                relatedEntityType: 'Payment',
                relatedEntityId: createdRentPayment.id,
                notificationData: { amount: agreement.monthlyRent, dueDate: firstRentDueDate },
            });
        } catch (error) {
            logger.error({ err: error }, 'Failed to send payment notifications');
        }
    }
}
