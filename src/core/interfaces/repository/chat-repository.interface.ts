import { IBaseRepository } from '../base/base-repository.interface.js';
import { CreateChatDto, SendMessageDto, ChatResponseDto, MessageResponseDto } from '@application/dtos/chat/chat.dto.js';

export interface IChatRepository extends IBaseRepository<ChatResponseDto, CreateChatDto> {
    create(data: CreateChatDto): Promise<ChatResponseDto>;
    findChatBetweenUsersForProperty(
        user1Id: string,
        user2Id: string,
        propertyId: string,
    ): Promise<ChatResponseDto | null>;
    getChatsForUser(userId: string): Promise<ChatResponseDto[]>;
    getMessagesForChat(chatId: string): Promise<MessageResponseDto[]>;
    saveMessage(data: SendMessageDto): Promise<MessageResponseDto>;
}
