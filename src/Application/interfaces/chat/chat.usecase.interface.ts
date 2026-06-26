import { SendMessageDto, ChatResponseDto, MessageResponseDto } from '@application/dtos/chat/chat.dto';

export interface IGetChatMessagesUseCase {
    execute(chatId: string): Promise<MessageResponseDto[]>;
}

export interface IGetMyChatsUseCase {
    execute(userId: string): Promise<ChatResponseDto[]>;
}

export interface IInitiateChatUseCase {
    execute(tenantId: string, ownerId: string, propertyId: string): Promise<ChatResponseDto>;
}

export interface ISendMessageUseCase {
    execute(data: SendMessageDto): Promise<MessageResponseDto>;
}
