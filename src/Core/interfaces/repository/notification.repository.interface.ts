import { NotificationEntity } from "@core/entities/notification.entity";
import { IBaseRepository } from "../base/base-repository.interface";

export interface INotificationRepository extends IBaseRepository<NotificationEntity>{
    findById(id:string):Promise<NotificationEntity | null >
    findByUserId(userId:string):Promise<NotificationEntity[]>
    markAsRead(notificationId:string):Promise<void>
    markAllAsRead(userId:string):Promise<void>
    getUnreadCount(userId:string):Promise<number>
    save(entity:NotificationEntity):Promise<NotificationEntity>
}