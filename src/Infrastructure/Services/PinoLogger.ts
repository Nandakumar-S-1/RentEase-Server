import pino from 'pino';
import { ILogger } from '@application/Interfaces/Services/ILogger';

const isDev = process.env.NODE_ENV !== 'production';

export class PinoLogger implements ILogger {
    private logger: pino.Logger;

    constructor() {
        this.logger = pino({
            level: process.env.LOG_LEVEL || 'info',
            formatters: {
                level(label) {
                    return { level: label };
                },
            },
            transport: isDev
                ? {
                      target: 'pino-pretty',
                      options: {
                          colorize: true,
                      },
                  }
                : undefined,
        });
    }

    info(message: string | object, ...args: any[]): void {
        if (typeof message === 'string') {
            this.logger.info(message, ...args);
        } else {
            this.logger.info(message, args[0]);
        }
    }

    error(message: string | object, ...args: any[]): void {
        if (typeof message === 'string') {
            this.logger.error(message, ...args);
        } else {
            this.logger.error(message, args[0]);
        }
    }

    warn(message: string | object, ...args: any[]): void {
        if (typeof message === 'string') {
            this.logger.warn(message, ...args);
        } else {
            this.logger.warn(message, args[0]);
        }
    }

    debug(message: string | object, ...args: any[]): void {
        if (typeof message === 'string') {
            this.logger.debug(message, ...args);
        } else {
            this.logger.debug(message, args[0]);
        }
    }
}
