import { container } from 'tsyringe';
import { ApplyLateFeesUseCase } from '@application/usecases/payment/apply-late-fees.usecase';
import { logger } from '@shared/log/logger';
import * as cron from 'node-cron';

export class PaymentScheduler {
    private _lateFeeCron: cron.ScheduledTask | null = null;

    start(): void {
        //late fee calc runss at 1pm
        this._lateFeeCron = cron.schedule('0 1 * * *', async () => {
            logger.info('Starting scheduled late fee calculation');
            try {
                const applyLateFees = container.resolve(ApplyLateFeesUseCase);
                await applyLateFees.execute();
                logger.info('Completed scheduled late fee calculation');
            } catch (error) {
                logger.error({ err: error }, 'Error in scheduled late fee calculation');
            }
        });

        logger.info('Payment scheduler started');
    }

    stop(): void {
        if (this._lateFeeCron) {
            this._lateFeeCron.stop();
            logger.info('Payment scheduler stopped');
        }
    }
}

export const paymentScheduler = new PaymentScheduler();
