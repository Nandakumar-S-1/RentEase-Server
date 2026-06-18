import { Server as HttpServer } from 'http';

export interface ISocketService {
    initialize(server: HttpServer): void;
    emitToUser(userId: string, event: string, data: unknown): void;
}
