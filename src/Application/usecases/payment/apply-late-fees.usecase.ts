import { IPaymentRepository } from '@core/interfaces/repository/payment-repository.interface';
import { ICreateNotificationUsecase } from '@application/interfaces/notification/notification.usecase.interface';
import { NotificationType } from '@shared/enums/notification-type.enum';
import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import { logger } from '@shared/log/logger';

//late fee
// grace period: 3 days after due date
// lte fee: ₹100 per day after grace period
// max late fee is 20% of rent amount

const GRACE_PERIOD_DAYS = 3;
const LATE_FEE_PER_DAY = 100;
const MAX_LATE_FEE_PERCENTAGE = 0.2;

@injectable()
export class ApplyLateFeesUseCase {
    constructor(
        @inject(TokenTypes.IPaymentRepository)
        private _paymentRepository: IPaymentRepository,
        @inject(TokenTypes.ICreateNotificationUseCase)
        private _createNotification: ICreateNotificationUsecase,
    ) {}

    async execute(): Promise<void> {
        const allPayments = await this._paymentRepository.findAll();
        const now = new Date();

        for (const payment of allPayments) {
            if (payment.category !== 'RENT' || payment.status !== 'PENDING' || !payment.dueDate) {
                continue;
            }
            const dueDate = new Date(payment.dueDate);
            const daysPastDue = Math.floor(
                (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24),
            );
            if (daysPastDue <= GRACE_PERIOD_DAYS) {
                continue;
            }

            const chargeableDays = daysPastDue - GRACE_PERIOD_DAYS;

            if (payment.daysLate === chargeableDays) {
                continue;
            }

            let lateFee = chargeableDays * LATE_FEE_PER_DAY;

            const maxLateFee = payment.amount * MAX_LATE_FEE_PERCENTAGE;
            if (lateFee > maxLateFee) {
                lateFee = maxLateFee;
            }

            const previousLateFee = payment.lateFeeApplied;
            payment.applyLateFee(lateFee, chargeableDays);
            await this._paymentRepository.update(payment);

            logger.info(
                {
                    paymentId: payment.id,
                    daysPastDue,
                    chargeableDays,
                    lateFee,
                    previousLateFee,
                },
                'Late fee applied to payment',
            );

            if (lateFee > previousLateFee) {
                try {
                    await this._createNotification.execute({
                        userId: payment.payerId,
                        notificationType: NotificationType.PAYMENT_OVERDUE,
                        title: 'Late Fee Applied',
                        message: `Your rent payment is ${daysPastDue} days overdue. A late fee of ₹${lateFee.toLocaleString()} has been added. Total amount due: ₹${payment.amount.toLocaleString()}.`,
                        actionUrl: `/payments/${payment.id}`,
                        relatedEntityType: 'Payment',
                        relatedEntityId: payment.id,
                        notificationData: {
                            lateFee,
                            daysPastDue,
                            totalAmount: payment.amount,
                        },
                    });
                } catch (error) {
                    logger.error({ err: error }, 'Failed to send late fee notification');
                }
            }
        }
    }

    async applyToPayment(paymentId: string): Promise<void> {
        const payment = await this._paymentRepository.findById(paymentId);
        if (!payment) {
            logger.warn({ paymentId }, 'Payment not found');
            return;
        }

        if (payment.category !== 'RENT' || payment.status !== 'PENDING' || !payment.dueDate) {
            return;
        }

        const now = new Date();
        const dueDate = new Date(payment.dueDate);
        const daysPastDue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysPastDue <= GRACE_PERIOD_DAYS) {
            return;
        }

        const chargeableDays = daysPastDue - GRACE_PERIOD_DAYS;
        let lateFee = chargeableDays * LATE_FEE_PER_DAY;

        const maxLateFee = payment.amount * MAX_LATE_FEE_PERCENTAGE;
        if (lateFee > maxLateFee) {
            lateFee = maxLateFee;
        }

        payment.applyLateFee(lateFee, chargeableDays);
        await this._paymentRepository.update(payment);

        logger.info({ paymentId, daysPastDue, chargeableDays, lateFee }, 'Late fee applied');
    }
}
