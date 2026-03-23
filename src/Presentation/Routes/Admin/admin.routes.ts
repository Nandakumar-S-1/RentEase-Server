import { injectable } from 'tsyringe';
import { BaseRoute } from '../Base/base.route';
import { asyncHandlerFunction } from '@presentation/Utils/asyncHandler';
import { UserManagementController } from '@presentation/Controllers/Admin/UserManagement.controller';
import { AdminLoginController } from '@presentation/Controllers/Admin/AdminLogin.controller';
import { ADMIN_ROUTES } from '@shared/Constants/Routes';
import { AdminOwnerVerificationController } from '@presentation/Controllers/Admin/AdminOwnerVerification.controller';
import { authMiddleware } from '@presentation/Middlewares/Auth.middleware';

@injectable()
export class AdminRoutes extends BaseRoute {
    constructor(
        private readonly _userManagementController: UserManagementController,
        private readonly _adminLoginController: AdminLoginController,
        private readonly _adminOwnerVerificationController: AdminOwnerVerificationController,
    ) {
        super();
        this.initializeRoutes();
    }
    protected initializeRoutes(): void {
        this.router.post(
            ADMIN_ROUTES.LOGIN,
            asyncHandlerFunction(this._adminLoginController.login.bind(this._adminLoginController)),
        );

        this.router.get(
            ADMIN_ROUTES.USERS.BASE,
            asyncHandlerFunction(
                this._userManagementController.getAllUsers.bind(this._userManagementController),
            ),
        );
        this.router.patch(
            ADMIN_ROUTES.USERS.SUSPEND,
            asyncHandlerFunction(
                this._userManagementController.suspendUser.bind(this._userManagementController),
            ),
        );
        this.router.patch(
            ADMIN_ROUTES.USERS.ACTIVATE,
            asyncHandlerFunction(
                this._userManagementController.activateUser.bind(this._userManagementController),
            ),
        );
        this.router.patch(
            ADMIN_ROUTES.USERS.DEACTIVATE,
            asyncHandlerFunction(
                this._userManagementController.deactivateUser.bind(this._userManagementController),
            ),
        );

        this.router.get(
            ADMIN_ROUTES.OWNER_VERIFICATION.PENDING,
            authMiddleware,
            asyncHandlerFunction(this._adminOwnerVerificationController.listPendingOwners),
        );
        this.router.patch(
            ADMIN_ROUTES.OWNER_VERIFICATION.VERIFY,
            authMiddleware,
            asyncHandlerFunction(this._adminOwnerVerificationController.verifyOwner),
        );
        this.router.patch(
            ADMIN_ROUTES.OWNER_VERIFICATION.REJECT,
            authMiddleware,
            asyncHandlerFunction(this._adminOwnerVerificationController.rejectOwner),
        );
    }
}
