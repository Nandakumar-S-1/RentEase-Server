import { injectable } from 'tsyringe';
import { BaseRoute } from '../base/base.route';
import { NotificationController } from '@presentation/controllers/notification/notification.controller';
import { authMiddleware } from '@presentation/middlewares/auth.middleware';
import { asyncHandlerFunction } from '@presentation/utils/async-handler';
import { NOTIFICATION_ROUTES } from '@shared/constants/routes';

@injectable()
export class NotificationRoutes extends BaseRoute {
    constructor(private readonly _controller: NotificationController) {
        super();
        this.initializeRoutes();
    }

    protected initializeRoutes(): void {
        this.router.use(authMiddleware);

        this.router.get(
            NOTIFICATION_ROUTES.GET_MY,
            asyncHandlerFunction(this._controller.getMyNotifications.bind(this._controller)),
        );
        this.router.get(
            NOTIFICATION_ROUTES.UNREAD_COUNT,
            asyncHandlerFunction(this._controller.getUnreadCount.bind(this._controller)),
        );
        this.router.patch(
            NOTIFICATION_ROUTES.MARK_ALL_AS_READ,
            asyncHandlerFunction(this._controller.markAllAsRead.bind(this._controller)),
        );
        this.router.patch(
            NOTIFICATION_ROUTES.MARK_AS_READ,
            asyncHandlerFunction(this._controller.markAsRead.bind(this._controller)),
        );
    }
}
