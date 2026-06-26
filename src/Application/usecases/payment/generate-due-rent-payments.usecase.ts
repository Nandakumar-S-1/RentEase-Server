import { IPaymentRepository } from '@core/interfaces/repository/payment-repository.interface';
import { IAgreementRepository } from '@core/interfaces/repository/agreement-repository.interface';
import { ICreateNotificationUsecase } from '@application/interfaces/notification/notification.usecase.interface';
import { PaymentEntity } from '@core/entities/payment.entity';
import { NotificationType } from '@shared/enums/notification-type.enum';
import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import { logger } from '@shared/log/logger';
import { v4 as uuidv4 } from 'uuid';
import { AgreementStatus } from '@core/types/agreement.types';
import { PaymentCategory, PaymentStatus } from '@core/types/payment.types';

@injectable()
export class GenerateDueRentPaymentsUseCase {
    constructor(
        @inject(TokenTypes.IPaymentRepository) private _paymentRepository: IPaymentRepository,
        @inject(TokenTypes.IAgreementRepository) private _agreementRepository: IAgreementRepository,
        @inject(TokenTypes.ICreateNotificationUseCase)
        private _createNotification: ICreateNotificationUsecase,
    ) {}

    async execute(): Promise<void> {
        logger.info('Starting scheduled generation of due rent payments');
         
        const activeAgreements = await this._agreementRepository.findAll({
            status: AgreementStatus.ACTIVE,
        });

        for (const agreement of activeAgreements) {
            const now = new Date();
            if (agreement.endDate && new Date(agreement.endDate) < now) {
                continue;
            }

            const existingPayments = await this._paymentRepository.findByAgreementId(agreement.id);
            const rentPayments = existingPayments.filter(
                (p) => p.category === PaymentCategory.RENT && p.dueDate,
            );

            if (rentPayments.length === 0) continue;

            rentPayments.sort(
                (a, b) => new Date(b.dueDate!).getTime() - new Date(a.dueDate!).getTime(),
            );
            const latestRentPayment = rentPayments[0];

            const nextDueDate = new Date(latestRentPayment.dueDate!);
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);

            const today = new Date();

            today.setHours(0, 0, 0, 0);
            const dueDay = new Date(nextDueDate);
            dueDay.setHours(0, 0, 0, 0);

            if (dueDay.getTime() <= today.getTime()) {
                const nextPaymentExists = existingPayments.some(
                    (p) =>
                        p.category === PaymentCategory.RENT &&
                        p.dueDate &&
                        new Date(p.dueDate).getTime() === nextDueDate.getTime(),
                );

                if (!nextPaymentExists) {
                    const nextRentPayment = PaymentEntity.create({
                        id: uuidv4(),
                        transactionId: undefined,
                        agreementId: agreement.id,
                        propertyId: agreement.propertyId,
                        payerId: agreement.tenantId,
                        payeeId: agreement.ownerId,
                        amount: agreement.monthlyRent,
                        category: PaymentCategory.RENT,
                        dueDate: nextDueDate,
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

                    await this._paymentRepository.create(nextRentPayment);

                    logger.info(
                        {
                            agreementId: agreement.id,
                            paymentId: nextRentPayment.id,
                            dueDate: nextDueDate,
                        },
                        'Next rent payment generated via cron',
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
                            notificationData: {
                                amount: agreement.monthlyRent,
                                dueDate: nextDueDate,
                            },
                        });
                    } catch (error) {
                        logger.error({ err: error }, 'Failed to send rent payment notification');
                    }
                }
            }
        }
    }
}
