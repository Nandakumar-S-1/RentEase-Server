export interface INotificationResponseDTO {
    id: string;
    notificationType: string;
    title: string;
    message: string;
    notificationData: Record<string, unknown> | null;
    actionUrl: string | null;
    relatedEntityType: string | null;
    relatedEntityId: string | null;
    isRead: boolean;
    readAt: Date | null;
    createdAt: Date;
}
