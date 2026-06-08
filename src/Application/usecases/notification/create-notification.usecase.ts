import { CreateNotificationDTO } from "@application/dtos/notification/create-notification-dto";
import { ICreateNotificationUsecase } from "@application/interfaces/notification/notification.usecase.interface";
import { NotificationEntity } from "@core/entities/notification.entity";
import { INotificationRepository } from "@core/interfaces/repository/notification.repository.interface";
import { inject, injectable } from "tsyringe";
import { TokenTypes } from "@shared/types/tokens";

import { ISocketService } from "@application/interfaces/services/socket.service.interface";

@injectable()
export class CreateNotificationUseCase implements ICreateNotificationUsecase {
    constructor(
        @inject(TokenTypes.INotificationRepository)
        private readonly notificationRepository: INotificationRepository,
        @inject(TokenTypes.ISocketService)
        private readonly socketService: ISocketService
    ) { }
    async execute(dto: CreateNotificationDTO): Promise<NotificationEntity> {
        const notification = NotificationEntity.create({
            id: crypto.randomUUID(),
            userId: dto.userId,
            notificationType: dto.notificationType,
            title: dto.title,
            message: dto.message,
            notificationData: dto.notificationData ?? null,
            actionUrl: dto.actionUrl ?? null,
            relatedEntityType: dto.relatedEntityType ?? null,
            relatedEntityId: dto.relatedEntityId ?? null,
            isRead: false,
            readAt: null,
            sentThroughEmail: false,
            sentThroughPushNote: false,
            createdAt: new Date()
        })
        const savedNotification = await this.notificationRepository.create(notification);
        this.socketService.emitToUser(dto.userId, 'notification:new', savedNotification);

        return savedNotification;
    }
}