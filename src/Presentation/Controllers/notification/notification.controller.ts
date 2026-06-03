import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { TokenTypes } from '@shared/types/tokens';
import {
    ICreateNotificationUsecase,
    IGetUserNotificationsUseCase,
} from '@application/interfaces/notification/notification.usecase.interface';
import { INotificationRepository } from '@core/interfaces/repository/notification.repository.interface';
import { ResponseHandler } from '@presentation/utils/response-handler';
import { Http_StatusCodes } from '@shared/enums/http-status-codes.enum';
import { NotFoundError } from '@shared/errors/common-errors';

@injectable()
export class NotificationController {
    constructor(
        @inject(TokenTypes.IGetUserNotificationsUseCase)
        private readonly getUserNotificationsUseCase: IGetUserNotificationsUseCase,

        @inject(TokenTypes.INotificationRepository)
        private readonly notificationRepository: INotificationRepository,
    ) {}

    getMyNotifications = async (req: Request, res: Response): Promise<Response> => {
        const userId = req.user!.id;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;

        const notifications = await this.getUserNotificationsUseCase.execute({
            userId,
            page,
            limit,
        });

        const unreadCount = await this.notificationRepository.getUnreadCount(userId);

        return ResponseHandler.success(res, { notifications, unreadCount });
    };

    markAsRead = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id as string;
        const userId = req.user!.id;

        const notification = await this.notificationRepository.findById(id);
        if (!notification || notification.userId !== userId) {
            throw new NotFoundError('Notification not found');
        }

        await this.notificationRepository.markAsRead(id);
        return ResponseHandler.success(res, null, 'Notification marked as read');
    };

    markAllAsRead = async (req: Request, res: Response): Promise<Response> => {
        const userId = req.user!.id;
        await this.notificationRepository.markAllAsRead(userId);
        return ResponseHandler.success(res, null, 'All notifications marked as read');
    };

    getUnreadCount = async (req: Request, res: Response): Promise<Response> => {
        const userId = req.user!.id;
        const count = await this.notificationRepository.getUnreadCount(userId);
        return ResponseHandler.success(res, { unreadCount: count });
    };
}
