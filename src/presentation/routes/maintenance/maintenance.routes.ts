import { injectable } from 'tsyringe';
import { BaseRoute } from '../base/base.route';
import { MaintenanceController } from '@presentation/controllers/maintenance/maintenance.controller';
import { MAINTENANCE_ROUTES } from '@shared/constants/routes';
import { authMiddleware } from '@presentation/middlewares/auth.middleware';
import { neededRole } from '@presentation/middlewares/role.middleware';
import { UserRole } from '@shared/enums/user-role.enum';
import { asyncHandlerFunction } from '@presentation/utils/async-handler';

@injectable()
export class MaintenanceRoutes extends BaseRoute {
    constructor(private readonly _controller: MaintenanceController) {
        super();
        this.initializeRoutes();
    }

    protected initializeRoutes(): void {
        this.router.post(
            MAINTENANCE_ROUTES.CREATE,
            authMiddleware,
            neededRole(UserRole.TENANT),
            asyncHandlerFunction(this._controller.createRequest.bind(this._controller)),
        );

        this.router.get(
            MAINTENANCE_ROUTES.GET,
            authMiddleware,
            neededRole(UserRole.TENANT, UserRole.OWNER),
            asyncHandlerFunction(this._controller.getRequests.bind(this._controller)),
        );

        this.router.put(
            MAINTENANCE_ROUTES.ASSIGN_PROVIDER,
            authMiddleware,
            neededRole(UserRole.OWNER),
            asyncHandlerFunction(this._controller.assignProvider.bind(this._controller)),
        );

        this.router.put(
            MAINTENANCE_ROUTES.UPDATE_STATUS,
            authMiddleware,
            neededRole(UserRole.OWNER),
            asyncHandlerFunction(this._controller.updateStatus.bind(this._controller)),
        );
    }
}
