import { injectable } from 'tsyringe';
import { IChatRepository } from '@core/interfaces/repository/chat-repository.interface';
import { CreateChatDto, SendMessageDto } from '@application/dtos/chat/chat.dto';
import { prisma } from '@infrastructure/database/prisma/prisma.client';
import { Chat, Message } from '@prisma/client';

@injectable()
export class ChatRepository implements IChatRepository {
    async create(data: CreateChatDto): Promise<Chat> {
        return prisma.chat.create({
            data: {
                participant1Id: data.participant1Id,
                participant2Id: data.participant2Id,
                propertyId: data.propertyId,
            },
            include: {
                participant1: true,
                participant2: true,
                property: true,
            },
        });
    }

    async findChatBetweenUsersForProperty(
        user1Id: string,
        user2Id: string,
        propertyId: string,
    ): Promise<Chat | null> {
        return prisma.chat.findFirst({
            where: {
                propertyId,
                OR: [
                    { participant1Id: user1Id, participant2Id: user2Id },
                    { participant1Id: user2Id, participant2Id: user1Id },
                ],
            },
            include: {
                participant1: true,
                participant2: true,
                property: true,
            },
        });
    }

    async getChatsForUser(userId: string): Promise<Chat[]> {
        return prisma.chat.findMany({
            where: {
                OR: [{ participant1Id: userId }, { participant2Id: userId }],
            },
            include: {
                participant1: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                        role: true,
                        lastActive: true,
                    },
                },
                participant2: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                        role: true,
                        lastActive: true,
                    },
                },
                property: { select: { id: true, title: true, photos: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });
    }

    async getMessagesForChat(chatId: string): Promise<Message[]> {
        return prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: { select: { id: true, fullName: true, avatarUrl: true } },
            },
        });
    }

    async saveMessage(data: SendMessageDto): Promise<Message> {
        return prisma.$transaction(async (tx) => {
            const message = await tx.message.create({
                data: {
                    chatId: data.chatId,
                    senderId: data.senderId,
                    content: data.content,
                    attachmentUrl: data.attachmentUrl,
                    attachmentType: data.attachmentType,
                },
                include: {
                    sender: { select: { id: true, fullName: true, avatarUrl: true } },
                },
            });

            await tx.chat.update({
                where: { id: data.chatId },
                data: { updatedAt: new Date() },
            });

            return message;
        });
    }
}
