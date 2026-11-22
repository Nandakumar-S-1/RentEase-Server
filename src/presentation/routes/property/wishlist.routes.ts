import { injectable } from 'tsyringe';
import { BaseRoute } from '../base/base.route';
import { WishlistController } from '@presentation/controllers/property/wishlist.controller';
import { authMiddleware } from '@presentation/middlewares/auth.middleware';
import { asyncHandlerFunction } from '@presentation/utils/async-handler';
import { WISHLIST_ROUTES } from '@shared/constants/routes';

@injectable()
export class WishlistRoutes extends BaseRoute {
    constructor(private readonly _controller: WishlistController) {
        super();
        this.initializeRoutes();
    }

    protected initializeRoutes(): void {
        this.router.post(
            WISHLIST_ROUTES.TOGGLE,
            authMiddleware,
            asyncHandlerFunction(this._controller.toggleWishlist.bind(this._controller)),
        );

        this.router.get(
            WISHLIST_ROUTES.GET_MY,
            authMiddleware,
            asyncHandlerFunction(this._controller.getMyWishlist.bind(this._controller)),
        );

        this.router.get(
            WISHLIST_ROUTES.CHECK,
            authMiddleware,
            asyncHandlerFunction(this._controller.checkWishlisted.bind(this._controller)),
        );
    }
}
