import 'reflect-metadata'; //enable decorator metadata
import 'dotenv/config';

import '@presentation/Dependency-Injection/Container'; //execute the DI container setup
import { App } from '@infrastructure/Config/app';

import { logger } from '@shared/Log/logger';
import { verifyServices } from '@infrastructure/Connections/verifyServices';

const PORT = process.env.PORT || 3000;

async function serverStart() {
  try {
    await verifyServices();
    const app = new App();
    const expressApplication = app.getApp();

    expressApplication.listen(PORT, () => {
      logger.info(`🚀 Server running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error({ err: error }, 'server startup has failed');
    process.exit(1);
  }
}

serverStart();
