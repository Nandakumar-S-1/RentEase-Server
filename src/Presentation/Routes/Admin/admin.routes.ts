import { injectable } from 'tsyringe';
import { BaseRoute } from '../base/base.route';
import { asyncHandlerFunction } from 'presentation/Utils/async-handler';
import { UserManagementController } from 'presentation/controllers/admin/user-management.controller';
import { AdminLoginController } from 'presentation/controllers/admin/admin-login.controller';
import { ADMIN_ROUTES } from 'shared/constants/routes';
import { AdminOwnerVerificationController } from 'presentation/controllers/admin/admin-owner-verification.controller';
import { authMiddleware } from 'presentation/middlewares/auth.middleware';
import { neededRole } from 'presentation/middlewares/role.middleware';
import { UserRole } from 'shared/enums/user-role.enum';

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
        this.router.post(
            ADMIN_ROUTES.GOOGLE_LOGIN,
            asyncHandlerFunction(
                this._adminLoginController.googleLogin.bind(this._adminLoginController),
            ),
        );

        this.router.get(
            ADMIN_ROUTES.USERS.BASE,
            authMiddleware,
            neededRole(UserRole.ADMIN),
            asyncHandlerFunction(
                this._userManagementController.getAllUsers.bind(this._userManagementController),
            ),
        );
        this.router.patch(
            ADMIN_ROUTES.USERS.SUSPEND,
            authMiddleware,
            neededRole(UserRole.ADMIN),
            asyncHandlerFunction(
                this._userManagementController.suspendUser.bind(this._userManagementController),
            ),
        );
        this.router.patch(
            ADMIN_ROUTES.USERS.ACTIVATE,
            authMiddleware,
            neededRole(UserRole.ADMIN),
            asyncHandlerFunction(
                this._userManagementController.activateUser.bind(this._userManagementController),
            ),
        );
        this.router.patch(
            ADMIN_ROUTES.USERS.DEACTIVATE,
            authMiddleware,
            neededRole(UserRole.ADMIN),
            asyncHandlerFunction(
                this._userManagementController.deactivateUser.bind(this._userManagementController),
            ),
        );

        this.router.get(
            ADMIN_ROUTES.OWNER_VERIFICATION.PENDING,
            authMiddleware,
            neededRole(UserRole.ADMIN),
            asyncHandlerFunction(this._adminOwnerVerificationController.listPendingOwners),
        );
        this.router.get(
            ADMIN_ROUTES.OWNER_VERIFICATION.DETAILS,
            authMiddleware,
            neededRole(UserRole.ADMIN),
            asyncHandlerFunction(this._adminOwnerVerificationController.ownerVerificationDetails),
        );
        this.router.patch(
            ADMIN_ROUTES.OWNER_VERIFICATION.VERIFY,
            authMiddleware,
            neededRole(UserRole.ADMIN),
            asyncHandlerFunction(this._adminOwnerVerificationController.verifyOwner),
        );
        this.router.patch(
            ADMIN_ROUTES.OWNER_VERIFICATION.REJECT,
            authMiddleware,
            neededRole(UserRole.ADMIN),
            asyncHandlerFunction(this._adminOwnerVerificationController.rejectOwner),
        );
    }
}
