export interface CreateChatDto {
    participant1Id: string;
    participant2Id: string;
    propertyId: string;
}

export interface SendMessageDto {
    chatId: string;
    senderId: string;
    content?: string;
    attachmentUrl?: string;
    attachmentType?: string;
}

export interface ChatResponseDto {
    id: string;
    participant1Id: string;
    participant2Id: string;
    propertyId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface MessageResponseDto {
    id: string;
    chatId: string;
    senderId: string;
    content: string | null;
    attachmentUrl: string | null;
    attachmentType: string | null;
    status: string;
    createdAt: Date;
}
