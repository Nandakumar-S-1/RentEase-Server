import pino from 'pino';
import { ILogger } from '@application/interfaces/services/logger.service.interface';

// const isProd = process.env.NODE_ENV !== 'production';

export class PinoLogger implements ILogger {
    private logger: pino.Logger;

    constructor() {
        const isProd = process.env.NODE_ENV === 'production';
        const logLevel = process.env.LOG_LEVEL || 'info';
        const logFilePath = process.env.LOG_FILE_PATH || './src/shared/log/app.log';
        const logFileSize = process.env.LOG_FILE_SIZE || '10m';
        const logFileCount = Number(process.env.LOG_FILE_COUNT) || 7;

        this.logger = pino({
            level: logLevel,
            transport: {
                targets: [
                    ...(!isProd
                        ? [
                              {
                                  target: 'pino-pretty',
                                  options: {
                                      colorize: true,
                                      translateTime: 'yyyy-mm-dd HH:MM:ss',
                                      ignore: 'pid,hostname',
                                  },
                                  level: logLevel,
                              },
                          ]
                        : []),
                    {
                        target: 'pino-roll',
                        options: {
                            file: logFilePath,
                            size: logFileSize,
                            count: logFileCount,
                            mkdir: true,
                        },
                        level: logLevel,
                    },
                ],
            },
        });
    }

    // constructor() {
    //     this.logger = pino({
    //         level: process.env.LOG_LEVEL || 'info',
    //         formatters: {
    //             level(label) {
    //                 return { level: label };
    //             },
    //         },
    //         transport: isDev
    //             ? {
    //                   target: 'pino-pretty',
    //                   options: {
    //                       colorize: true,
    //                   },
    //               }
    //             : undefined,
    //     });
    // }

    private formatMessage(message: string, args: unknown[]): string {
        if (args.length === 0) return message;
        return `${message} ${args.map(String).join(' ')}`;
    }

    private formatObject(message: object, args: unknown[]): object {
        if (args.length === 0) return message;
        const record = message as Record<string, unknown>;
        return {
            ...record,
            _args: args.map(String),
        };
    }

    info(message: string | object, ...args: unknown[]): void {
        if (typeof message === 'string') {
            this.logger.info(this.formatMessage(message, args));
            return;
        }
        this.logger.info(this.formatObject(message, args));
    }

    error(message: string | object, ...args: unknown[]): void {
        if (typeof message === 'string') {
            this.logger.error(this.formatMessage(message, args));
            return;
        }
        this.logger.error(this.formatObject(message, args));
    }

    warn(message: string | object, ...args: unknown[]): void {
        if (typeof message === 'string') {
            this.logger.warn(this.formatMessage(message, args));
            return;
        }
        this.logger.warn(this.formatObject(message, args));
    }

    debug(message: string | object, ...args: unknown[]): void {
        if (typeof message === 'string') {
            this.logger.debug(this.formatMessage(message, args));
            return;
        }
        this.logger.debug(this.formatObject(message, args));
    }
}
