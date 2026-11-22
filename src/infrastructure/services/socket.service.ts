import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { ISocketService } from '@application/interfaces/services/socket.service.interface';
import { injectable } from 'tsyringe';
import { logger } from '@shared/log/logger';

@injectable()
export class SocketService implements ISocketService {
    private _io: Server | null = null;
    private _userSocketMap: Map<string, string[]> = new Map();

    initialize(server: HttpServer): void {
        this._io = new Server(server, {
            cors: {
                origin: ['http://localhost:5173', 'http://localhost:5174'],
                credentials: true,
            },
        });

        this._io.on('connection', (socket: Socket) => {
            const userId = socket.handshake.query.userId as string;

            if (userId) {
                this.addUserSocket(userId, socket.id);
                logger.info({ userId, socketId: socket.id }, 'User connected to socket');
            } else {
                logger.warn({ socketId: socket.id }, 'Socket connected without userId');
            }

            socket.on('join_chat', (chatId: string) => {
                socket.join(chatId);
                logger.info({ userId, chatId }, 'User joined chat room');
            });

            socket.on('leave_chat', (chatId: string) => {
                socket.leave(chatId);
                logger.info({ userId, chatId }, 'User left chat room');
            });

            socket.on('typing', (chatId: string) => {
                socket.to(chatId).emit('typing', { chatId, userId });
            });

            socket.on('stop_typing', (chatId: string) => {
                socket.to(chatId).emit('stop_typing', { chatId, userId });
            });

            socket.on('disconnect', () => {
                if (userId) {
                    this.removeUserSocket(userId, socket.id);
                    logger.info({ userId, socketId: socket.id }, 'User disconnected from socket');
                }
            });
        });
    }

    private addUserSocket(userId: string, socketId: string) {
        if (!this._userSocketMap.has(userId)) {
            this._userSocketMap.set(userId, []);
        }
        this._userSocketMap.get(userId)?.push(socketId);
    }

    private removeUserSocket(userId: string, socketId: string) {
        const sockets = this._userSocketMap.get(userId);
        if (sockets) {
            const updatedSockets = sockets.filter((id) => id !== socketId);
            if (updatedSockets.length === 0) {
                this._userSocketMap.delete(userId);
            } else {
                this._userSocketMap.set(userId, updatedSockets);
            }
        }
    }

    emitToUser(userId: string, event: string, data: unknown): void {
        if (!this._io) {
            logger.error('SocketService not initialized before emitToUser');
            return;
        }

        const socketIds = this._userSocketMap.get(userId);
        if (socketIds && socketIds.length > 0) {
            socketIds.forEach((socketId) => {
                this._io?.to(socketId).emit(event, data);
            });
            logger.info({ userId, event }, 'Emitted socket event to user');
        } else {
            logger.info({ userId, event }, 'User not connected, socket event skipped');
        }
    }

    emitToRoom(room: string, event: string, data: unknown): void {
        if (!this._io) {
            logger.error('SocketService not initialized before emitToRoom');
            return;
        }
        this._io.to(room).emit(event, data);
        logger.info({ room, event }, 'Emitted socket event to room');
    }

    isUserOnline(userId: string): boolean {
        const sockets = this._userSocketMap.get(userId);
        return !!sockets && sockets.length > 0;
    }
}
