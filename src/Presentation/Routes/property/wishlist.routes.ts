import { injectable } from 'tsyringe';
import { BaseRoute } from '../base/base.route';
import { WishlistController } from '@presentation/controllers/property/wishlist.controller';
import { authMiddleware } from '@presentation/middlewares/auth.middleware';
import { asyncHandlerFunction } from '@presentation/utils/async-handler';

@injectable()
export class WishlistRoutes extends BaseRoute {
    constructor(private readonly _controller: WishlistController) {
        super();
        this.initializeRoutes();
    }

    protected initializeRoutes(): void {
        this.router.post(
            '/:propertyId',
            authMiddleware,
            asyncHandlerFunction(this._controller.toggleWishlist.bind(this._controller)),
        );

        this.router.get(
            '/',
            authMiddleware,
            asyncHandlerFunction(this._controller.getMyWishlist.bind(this._controller)),
        );

        this.router.get(
            '/check/:propertyId',
            authMiddleware,
            asyncHandlerFunction(this._controller.checkWishlisted.bind(this._controller)),
        );
    }
}
