export interface ILogger {
    info(message: string | object, ...args: unknown[]): void;
    error(message: string | object, ...args: unknown[]): void;
    warn(message: string | object, ...args: unknown[]): void;
    debug(message: string | object, ...args: unknown[]): void;
}
