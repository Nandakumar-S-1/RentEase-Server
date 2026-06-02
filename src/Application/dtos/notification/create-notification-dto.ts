import { NotificationType } from "@shared/enums/notification-type.enum";

export interface CreateNotificationDTO{
    userId:string,
    notificationType:NotificationType,
    title:string,
    message:string,
    notificationData?:Record<string,unknown>
    actionUrl?:string,

    relatedEntityType?:string,
    relatedEntityId?:string
}