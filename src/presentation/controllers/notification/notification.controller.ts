import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { TokenTypes } from '@shared/types/tokens';
import { IGetUserNotificationsUseCase } from '@application/interfaces/notification/notification.usecase.interface';
import { INotificationRepository } from '@core/interfaces/repository/notification.repository.interface';
import { ResponseHandler } from '@presentation/utils/response-handler';
import { NotFoundError } from '@shared/errors/common-errors';
import { IGetUserNotificationRequestDTO } from '@application/dtos/notification/get-user-notification-request-dto';

@injectable()
export class NotificationController {
    constructor(
        @inject(TokenTypes.IGetUserNotificationsUseCase)
        private readonly _getUserNotificationsUseCase: IGetUserNotificationsUseCase,

        @inject(TokenTypes.INotificationRepository)
        private readonly _notificationRepository: INotificationRepository,
    ) {}

    getMyNotifications = async (req: Request, res: Response): Promise<Response> => {
        const userId = req.user!.id;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;

        const dto: IGetUserNotificationRequestDTO = { userId, page, limit };
        const notifications = await this._getUserNotificationsUseCase.execute(dto);

        const unreadCount = await this._notificationRepository.getUnreadCount(userId);

        return ResponseHandler.success(res, { notifications, unreadCount });
    };

    markAsRead = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id as string;
        const userId = req.user!.id;

        const notification = await this._notificationRepository.findById(id);
        if (!notification || notification.userId !== userId) {
            throw new NotFoundError('Notification not found');
        }

        await this._notificationRepository.markAsRead(id);
        return ResponseHandler.success(res, null, 'Notification marked as read');
    };

    markAllAsRead = async (req: Request, res: Response): Promise<Response> => {
        const userId = req.user!.id;
        await this._notificationRepository.markAllAsRead(userId);
        return ResponseHandler.success(res, null, 'All notifications marked as read');
    };

    getUnreadCount = async (req: Request, res: Response): Promise<Response> => {
        const userId = req.user!.id;
        const count = await this._notificationRepository.getUnreadCount(userId);
        return ResponseHandler.success(res, { unreadCount: count });
    };
}
