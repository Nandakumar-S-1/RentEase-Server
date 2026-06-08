import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { ISocketService } from '@application/interfaces/services/socket.service.interface';
import { injectable } from 'tsyringe';
import { logger } from '@shared/log/logger';

@injectable()
export class SocketService implements ISocketService {
    private io: Server | null = null;
    private userSocketMap: Map<string, string[]> = new Map();

    initialize(server: HttpServer): void {
        this.io = new Server(server, {
            cors: {
                origin: ['http://localhost:5173', 'http://localhost:5174'],
                credentials: true,
            },
        });

        this.io.on('connection', (socket: Socket) => {
            const userId = socket.handshake.query.userId as string;

            if (userId) {
                this.addUserSocket(userId, socket.id);
                logger.info({ userId, socketId: socket.id }, 'User connected to socket');
            } else {
                logger.warn({ socketId: socket.id }, 'Socket connected without userId');
            }

            socket.on('disconnect', () => {
                if (userId) {
                    this.removeUserSocket(userId, socket.id);
                    logger.info({ userId, socketId: socket.id }, 'User disconnected from socket');
                }
            });
        });
    }

    private addUserSocket(userId: string, socketId: string) {
        if (!this.userSocketMap.has(userId)) {
            this.userSocketMap.set(userId, []);
        }
        this.userSocketMap.get(userId)?.push(socketId);
    }

    private removeUserSocket(userId: string, socketId: string) {
        const sockets = this.userSocketMap.get(userId);
        if (sockets) {
            const updatedSockets = sockets.filter((id) => id !== socketId);
            if (updatedSockets.length === 0) {
                this.userSocketMap.delete(userId);
            } else {
                this.userSocketMap.set(userId, updatedSockets);
            }
        }
    }

    emitToUser(userId: string, event: string, data: any): void {
        if (!this.io) {
            logger.error('SocketService not initialized before emitToUser');
            return;
        }

        const socketIds = this.userSocketMap.get(userId);
        if (socketIds && socketIds.length > 0) {
            socketIds.forEach((socketId) => {
                this.io?.to(socketId).emit(event, data);
            });
            logger.info({ userId, event }, 'Emitted socket event to user');
        } else {
            logger.info({ userId, event }, 'User not connected, socket event skipped');
        }
    }
}
