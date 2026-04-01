import { ILogger } from 'application/interfaces/services/logger.service.interface';
import { PinoLogger } from 'infrastructure/services/pino-logger.service';

export const logger: ILogger = new PinoLogger();
