import { container } from 'tsyringe';
import { ApplyLateFeesUseCase } from '@application/usecases/payment/apply-late-fees.usecase';
import { GenerateDueRentPaymentsUseCase } from '@application/usecases/payment/generate-due-rent-payments.usecase';
import { logger } from '@shared/log/logger';
import * as cron from 'node-cron';

export class PaymentScheduler {
    private _lateFeeCron: cron.ScheduledTask | null = null;
    private _rentGenerationCron: cron.ScheduledTask | null = null;

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

        // rent generation runs at 2am
        this._rentGenerationCron = cron.schedule('0 2 * * *', async () => {
            logger.info('Starting scheduled rent generation');
            try {
                const generateRent = container.resolve(GenerateDueRentPaymentsUseCase);
                await generateRent.execute();
                logger.info('Completed scheduled rent generation');
            } catch (error) {
                logger.error({ err: error }, 'Error in scheduled rent generation');
            }
        });

        logger.info('Payment scheduler started');
    }

    stop(): void {
        if (this._lateFeeCron) {
            this._lateFeeCron.stop();
        }
        if (this._rentGenerationCron) {
            this._rentGenerationCron.stop();
        }
        logger.info('Payment scheduler stopped');
    }
}

export const paymentScheduler = new PaymentScheduler();
