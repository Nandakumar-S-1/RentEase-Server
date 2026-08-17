import 'reflect-metadata'; //enable decorator metadata
import 'dotenv/config';

import '@presentation/dependency-injection/Container'; //execute the DI container setup
import { App } from 'infrastructure/config/app';
import { paymentScheduler } from '@infrastructure/jobs/payment-scheduler';

import { logger } from 'shared/log/logger';
import { verifyServices } from 'infrastructure/connections/verify-services';
import http from 'http';
import { container } from 'tsyringe';
import { TokenTypes } from '@shared/types/tokens';
import { ISocketService } from '@application/interfaces/services/socket.service.interface';

const PORT = process.env.PORT || 3000;

async function serverStart() {
    try {
        await verifyServices();
        const app = new App();
        const expressApplication = app.getApp();

        const httpServer = http.createServer(expressApplication);

        const socketService = container.resolve<ISocketService>(TokenTypes.ISocketService);
        socketService.initialize(httpServer);

        httpServer.listen(PORT, () => {
            logger.info(`Server running on port http://localhost:${PORT}`);
            paymentScheduler.start();
            logger.info('Payment scheduler initialized');
        });
    } catch (error) {
        logger.error({ err: error }, 'server startup has failed');
        process.exit(1);
    }
}

serverStart();
