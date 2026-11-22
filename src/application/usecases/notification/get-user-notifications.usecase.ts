import { IGetUserNotificationsUseCase } from '@application/interfaces/notification/notification.usecase.interface';
import { IGetUserNotificationRequestDTO } from '@application/dtos/notification/get-user-notification-request-dto';
import { INotificationResponseDTO } from '@application/dtos/notification/get-user-notification-response.dto';
import { INotificationRepository } from '@core/interfaces/repository/notification.repository.interface';
import { NotificationMapper } from '@application/mappers/notification/notification.mapper';
import { inject, injectable } from 'tsyringe';
import { TokenTypes } from '@shared/types/tokens';

@injectable()
export class GetUserNotificationsUseCase implements IGetUserNotificationsUseCase {
    constructor(
        @inject(TokenTypes.INotificationRepository)
        private readonly notificationRepository: INotificationRepository,
    ) {}

    async execute(dto: IGetUserNotificationRequestDTO): Promise<INotificationResponseDTO[]> {
        const notifications = await this.notificationRepository.findByUserId(
            dto.userId,
            dto.page,
            dto.limit,
        );
        return notifications.map(NotificationMapper.toResponseDTO);
    }
}
