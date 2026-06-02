import { NotificationEntity } from "@core/entities/notification.entity";
import { INotificationRepository } from "@core/interfaces/repository/notification.repository.interface";
import { prisma } from "@infrastructure/database/prisma/prisma.client";
import { NotficationPersistenceMapper } from "@infrastructure/mappers/notification-persistence.mapper";
import { injectable } from "tsyringe";

@injectable()
export class NotificationRepository implements INotificationRepository{
    async create(entity: NotificationEntity): Promise<NotificationEntity> {
        const data= NotficationPersistenceMapper.toPersistence(entity)
        const res=await prisma.notification.create({
            data
        })
        return NotficationPersistenceMapper.toDomain(res)
    }
    async findById(id: string): Promise<NotificationEntity | null> {
        const notification = await prisma.notification.findUnique({
            where:{
                id
            }
        })
        if(!notification)return null
        return NotficationPersistenceMapper.toDomain(notification)
    }
    async findByUserId(userId: string): Promise<NotificationEntity[]> {
        const notifications = await prisma.notification.findMany({
            where:{
                userId
            },orderBy:{
                createdAt:'desc'
            }
        })
        return notifications.map(NotficationPersistenceMapper.toDomain)
    }
    async markAsRead(notificationId: string): Promise<void> {
        await prisma.notification.update({
            where:{
                id:notificationId
            },
            data:{
                isRead:true,
                readAt:new Date()
            }
        })
    }
    async markAllAsRead(userId: string): Promise<void> {
        await prisma.notification.updateMany({
            where:{
                userId,
                isRead:false
            },
            data:{
                isRead:true,
                readAt:new Date()
            }
        })
    }
    async getUnreadCount(userId: string): Promise<number> {
        return prisma.notification.count({
            where:{
                userId,
                isRead:false
            }
        })
    }
    async save(entity: NotificationEntity): Promise<NotificationEntity> {
        const data = NotficationPersistenceMapper.toPersistence(entity)
        const result = await prisma.notification.update({
            where:{
                id:entity.id
            },
            data
        })
        return NotficationPersistenceMapper.toDomain(result)
    }
}