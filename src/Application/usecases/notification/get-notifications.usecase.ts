import { IGetUserNotificationRequestDTO } from "@application/dtos/notification/get-user-notification-request-dto";
import { INotificationResponseDTO } from "@application/dtos/notification/get-user-notification-response.dto";
import { IGetUserNotificationsUseCase } from "@application/interfaces/notification/notification.usecase.interface";
import { INotificationRepository } from "@core/interfaces/repository/notification.repository.interface";
import { TokenTypes } from "@shared/types/tokens";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetUserNotificationsUseCase implements IGetUserNotificationsUseCase{
    constructor(
        @inject(TokenTypes.INotificationRepository)
        private readonly _notificationRepo:INotificationRepository
    ){}
    async execute(dto: IGetUserNotificationRequestDTO): Promise<INotificationResponseDTO[]> {
      const notifications = await this._notificationRepo.findByUserId(
        dto.userId
      )
      return notifications.map(notification => ({
            id: notification.id,
            notificationType: notification.notificationType,
            title: notification.title,
            message: notification.message,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
        }));
    }
}