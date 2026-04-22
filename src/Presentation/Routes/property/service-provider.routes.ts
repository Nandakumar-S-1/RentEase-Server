import { injectable } from 'tsyringe';
import { BaseRoute } from '../base/base.route';
import { ServiceProviderController } from '@presentation/controllers/property/service-provider.controller';
import { authMiddleware } from '@presentation/middlewares/auth.middleware';
import { neededRole } from '@presentation/middlewares/role.middleware';
import { UserRole } from '@shared/enums/user-role.enum';
import { asyncHandlerFunction } from '@presentation/utils/async-handler';

@injectable()
export class ServiceProviderRoutes extends BaseRoute {
    constructor(private readonly _controller: ServiceProviderController) {
        super();
        this.initializeRoutes();
    }

    protected initializeRoutes(): void {
        this.router.post(
            '/',
            authMiddleware,
            neededRole(UserRole.OWNER),
            asyncHandlerFunction(this._controller.addProvider.bind(this._controller)),
        );

        this.router.get(
            '/property/:propertyId',
            authMiddleware,
            asyncHandlerFunction(this._controller.getProvidersByProperty.bind(this._controller)),
        );

        this.router.patch(
            '/:id/status',
            authMiddleware,
            neededRole(UserRole.OWNER),
            asyncHandlerFunction(this._controller.toggleStatus.bind(this._controller)),
        );

        this.router.delete(
            '/:id',
            authMiddleware,
            neededRole(UserRole.OWNER),
            asyncHandlerFunction(this._controller.deleteProvider.bind(this._controller)),
        );
    }
}
