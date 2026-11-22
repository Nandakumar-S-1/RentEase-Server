import { CreateNotificationDTO } from '@application/dtos/notification/create-notification-dto';
import { IGetUserNotificationRequestDTO } from '@application/dtos/notification/get-user-notification-request-dto';
import { INotificationResponseDTO } from '@application/dtos/notification/get-user-notification-response.dto';
import { NotificationEntity } from '@core/entities/notification.entity';

export interface ICreateNotificationUsecase {
    execute(dto: CreateNotificationDTO): Promise<NotificationEntity>;
}

export interface IGetUserNotificationsUseCase {
    execute(dto: IGetUserNotificationRequestDTO): Promise<INotificationResponseDTO[]>;
}
