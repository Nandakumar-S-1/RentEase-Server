import { IPaymentRepository } from '@core/interfaces/repository/payment-repository.interface';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { ICreateNotificationUsecase } from '@application/interfaces/notification/notification.usecase.interface';
import { PaymentEntity } from '@core/entities/payment.entity';
import { NotificationType } from '@shared/enums/notification-type.enum';
import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import { logger } from '@shared/log/logger';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class GenerateNextRentPaymentUseCase {
    constructor(
        @inject(TokenTypes.IPaymentRepository) private _paymentRepository: IPaymentRepository,
        @inject(TokenTypes.IAgreementRepository)
        private _agreementRepository: IAgreementRepository,
        @inject(TokenTypes.ICreateNotificationUseCase)
        private _createNotification: ICreateNotificationUsecase,
    ) {}

    async execute(paidRentPaymentId: string): Promise<void> {
        const paidPayment = await this._paymentRepository.findById(paidRentPaymentId);
        if (!paidPayment) {
            logger.warn({ paidRentPaymentId }, 'Paid payment not found');
            return;
        }
        if (paidPayment.category !== 'RENT') {
            return;
        }

        const agreement = await this._agreementRepository.findById(paidPayment.agreementId);
        if (!agreement) {
            logger.warn({ agreementId: paidPayment.agreementId }, 'Agreement not found');
            return;
        }
        if (agreement.status !== 'ACTIVE') {
            return;
        }
        const now = new Date();
        if (agreement.endDate && new Date(agreement.endDate) < now) {
            logger.info(
                { agreementId: agreement.id },
                'Agreement has ended, not generating next rent',
            );
            return;
        }

        const nextDueDate = new Date(paidPayment.dueDate!);
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);

        const existingPayments = await this._paymentRepository.findByAgreementId(agreement.id);
        const nextPaymentExists = existingPayments.some(
            (p) =>
                p.category === 'RENT' && p.dueDate && p.dueDate.getTime() === nextDueDate.getTime(),
        );

        if (nextPaymentExists) {
            logger.info(
                { agreementId: agreement.id, nextDueDate },
                'Next rent payment already exists',
            );
            return;
        }

        const nextRentPayment = PaymentEntity.create({
            id: uuidv4(),
            transactionId: undefined,
            agreementId: agreement.id,
            propertyId: agreement.propertyId,
            payerId: agreement.tenantId,
            payeeId: agreement.ownerId,
            amount: agreement.monthlyRent,
            category: 'RENT',
            dueDate: nextDueDate,
            paidDate: undefined,
            paymentGateway: undefined,
            paymentMethod: undefined,
            status: 'PENDING',
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

        await this._paymentRepository.create(nextRentPayment);

        logger.info(
            { agreementId: agreement.id, paymentId: nextRentPayment.id, dueDate: nextDueDate },
            'Next rent payment generated',
        );

        try {
            await this._createNotification.execute({
                userId: agreement.tenantId,
                notificationType: NotificationType.PAYMENT_DUE,
                title: 'Rent Payment Due',
                message: `Your rent payment of ₹${agreement.monthlyRent.toLocaleString()} is due on ${nextDueDate.toLocaleDateString()}.`,
                actionUrl: `/payments/${nextRentPayment.id}`,
                relatedEntityType: 'Payment',
                relatedEntityId: nextRentPayment.id,
                notificationData: { amount: agreement.monthlyRent, dueDate: nextDueDate },
            });
        } catch (error) {
            logger.error({ err: error }, 'Failed to send rent payment notification');
        }
    }
}
