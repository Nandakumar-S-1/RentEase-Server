import { ILogger } from '@application/Interfaces/Services/ILogger';
import { PinoLogger } from '@infrastructure/Services/PinoLogger';

export const logger: ILogger = new PinoLogger();
