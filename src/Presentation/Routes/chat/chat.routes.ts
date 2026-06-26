import { injectable } from 'tsyringe';
import { BaseRoute } from '../base/base.route';
import { ChatController } from '@presentation/controllers/chat/chat.controller';
import { CHAT_ROUTES } from '@shared/constants/routes';
import { authMiddleware } from '@presentation/middlewares/auth.middleware';
import { asyncHandlerFunction } from '@presentation/utils/async-handler';

@injectable()
export class ChatRoutes extends BaseRoute {
    constructor(private readonly _controller: ChatController) {
        super();
        this.initializeRoutes();
    }

    protected initializeRoutes(): void {
        this.router.use(authMiddleware);

        this.router.post(
            CHAT_ROUTES.INITIATE,
            asyncHandlerFunction(this._controller.initiateChat.bind(this._controller)),
        );

        this.router.get(
            CHAT_ROUTES.GET_MY,
            asyncHandlerFunction(this._controller.getMyChats.bind(this._controller)),
        );

        this.router.get(
            CHAT_ROUTES.GET_MESSAGES,
            asyncHandlerFunction(this._controller.getChatMessages.bind(this._controller)),
        );

        this.router.post(
            CHAT_ROUTES.SEND_MESSAGE,
            asyncHandlerFunction(this._controller.sendMessage.bind(this._controller)),
        );

        this.router.post(
            CHAT_ROUTES.UPLOAD_PHOTO_URLS,
            asyncHandlerFunction(this._controller.uploadChatPhotoUrls.bind(this._controller)),
        );
    }
}
