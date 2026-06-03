import { NotificationEntity } from '@core/entities/notification.entity';
import { INotificationResponseDTO } from '@application/dtos/notification/get-user-notification-response.dto';

export class NotificationMapper {
    static toResponseDTO(entity: NotificationEntity): INotificationResponseDTO {
        return {
            id: entity.id,
            notificationType: entity.notificationType,
            title: entity.title,
            message: entity.message,
            notificationData: entity.notificationData,
            actionUrl: entity.actionUrl,
            relatedEntityType: entity.relatedEntityType,
            relatedEntityId: entity.relatedEntityId,
            isRead: entity.isRead,
            readAt: entity.readAt,
            createdAt: entity.createdAt,
        };
    }
}
