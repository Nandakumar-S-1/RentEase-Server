import { injectable } from 'tsyringe';
import { BaseRoute } from '../Base/base.route';
import { asyncHandlerFunction } from '@presentation/Utils/asyncHandler';
import { UserManagementController } from '@presentation/Controllers/Admin/UserManagement.controller';
import { AdminLoginController } from '@presentation/Controllers/Admin/AdminLogin.controller';

@injectable()
export class AdminRoutes extends BaseRoute {
    constructor(
        private readonly userManagementController: UserManagementController,
        private readonly adminLoginController: AdminLoginController
    ) {
        super();
        this.initializeRoutes();
    }

    protected initializeRoutes(): void {
        this.router.post('/login', asyncHandlerFunction(this.adminLoginController.login.bind(this.adminLoginController)));

        this.router.get('/users', asyncHandlerFunction(this.userManagementController.getAllUsers.bind(this.userManagementController)));
        this.router.patch('/users/suspend/:id', asyncHandlerFunction(this.userManagementController.suspendUser.bind(this.userManagementController)));
        this.router.patch('/users/activate/:id', asyncHandlerFunction(this.userManagementController.activateUser.bind(this.userManagementController)));
        this.router.patch('/users/deactivate/:id', asyncHandlerFunction(this.userManagementController.deactivateUser.bind(this.userManagementController)));
    }
}
