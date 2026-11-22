export interface IChat {
    id: string;
    participant1Id: string;
    participant2Id: string;
    propertyId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IMessage {
    id: string;
    chatId: string;
    senderId: string;
    content: string | null;
    attachmentUrl: string | null;
    attachmentType: string | null;
    status: string;
    createdAt: Date;
}
