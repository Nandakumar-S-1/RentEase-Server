import { NotificationEntity } from '@core/entities/notification.entity';
import { Notification, Prisma, NotificationType as PrismaNotificationType } from '@prisma/client';
import { NotificationType } from '@shared/enums/notification-type.enum';

export class NotficationPersistenceMapper {
    static toDomain(data: Notification): NotificationEntity {
        return NotificationEntity.create({
            id: data.id,
            userId: data.userId,
            notificationType: data.notificationType as NotificationType,
            title: data.title,
            message: data.message,
            notificationData: data.notificationData as Record<string, unknown> | null,
            actionUrl: data.actionUrl,
            relatedEntityType: data.relatedEntityType,
            relatedEntityId: data.relatedEntityId,
            isRead: data.isRead,
            readAt: data.readAt,
            sentThroughEmail: data.sentThroughEmail,
            sentThroughPushNote: data.sentThroughPush,
            createdAt: data.createdAt,
        });
    }
    static toPersistence(entity: NotificationEntity) {
        return {
            id: entity.id,
            userId: entity.userId,
            notificationType: entity.notificationType as PrismaNotificationType,
            title: entity.title,
            message: entity.message,
            notificationData:
                entity.notificationData == null
                    ? Prisma.JsonNull
                    : (entity.notificationData as Prisma.InputJsonValue),
            actionUrl: entity.actionUrl,
            relatedEntityType: entity.relatedEntityType,
            relatedEntityId: entity.relatedEntityId,
            isRead: entity.isRead,
            readAt: entity.readAt,
            sentThroughEmail: entity.sentThroughEmail,
            sentThroughPush: entity.sentThroughPush,
            createdAt: entity.createdAt,
        };
    }
}
