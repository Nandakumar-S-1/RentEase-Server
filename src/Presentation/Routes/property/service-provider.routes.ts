import { injectable } from 'tsyringe';
import { BaseRoute } from '../base/base.route';
import { ServiceProviderController } from '@presentation/controllers/property/service-provider.controller';
import { authMiddleware } from '@presentation/middlewares/auth.middleware';
import { neededRole } from '@presentation/middlewares/role.middleware';
import { UserRole } from '@shared/enums/user-role.enum';
import { asyncHandlerFunction } from '@presentation/utils/async-handler';
import { SERVICE_PROVIDER_ROUTES } from '@shared/constants/routes';

@injectable()
export class ServiceProviderRoutes extends BaseRoute {
    constructor(private readonly _controller: ServiceProviderController) {
        super();
        this.initializeRoutes();
    }

    protected initializeRoutes(): void {
        this.router.post(
            SERVICE_PROVIDER_ROUTES.ADD,
            authMiddleware,
            neededRole(UserRole.OWNER),
            asyncHandlerFunction(this._controller.addProvider.bind(this._controller)),
        );

        this.router.get(
            SERVICE_PROVIDER_ROUTES.GET_BY_PROPERTY,
            authMiddleware,
            asyncHandlerFunction(this._controller.getProvidersByProperty.bind(this._controller)),
        );

        this.router.patch(
            SERVICE_PROVIDER_ROUTES.TOGGLE_STATUS,
            authMiddleware,
            neededRole(UserRole.OWNER),
            asyncHandlerFunction(this._controller.toggleStatus.bind(this._controller)),
        );

        this.router.delete(
            SERVICE_PROVIDER_ROUTES.DELETE,
            authMiddleware,
            neededRole(UserRole.OWNER),
            asyncHandlerFunction(this._controller.deleteProvider.bind(this._controller)),
        );
    }
}
