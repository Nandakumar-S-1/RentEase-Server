import { NotificationType } from '@shared/enums/notification-type.enum';

export type NotificationTypeData = {
    id: string;
    userId: string;

    notificationType: NotificationType;
    title: string;
    message: string;
    notificationData: Record<string, unknown> | null;

    actionUrl: string | null;
    relatedEntityType: string | null;
    relatedEntityId: string | null;

    isRead: boolean;
    readAt: Date | null;

    sentThroughEmail: boolean;
    sentThroughPushNote: boolean;
    createdAt: Date;
};
