import { injectable } from 'tsyringe';
import { BaseRoute } from '../base/base.route';
import { OwnerVerificationController } from 'presentation/controllers/owner/owner-verification.controller';
import { OWNER_ROUTES } from 'shared/constants/routes';
import { authMiddleware } from 'presentation/middlewares/auth.middleware';
import { neededRole } from 'presentation/middlewares/role.middleware';
import { UserRole } from 'shared/enums/user-role.enum';
import { upload } from 'shared/uploads/cloudinary.upload';
import { validationRequestMiddleware } from 'presentation/middlewares/validation.middleware';
import { submitVerificationSchema } from 'application/validators/owner.validators';
import { asyncHandlerFunction } from 'presentation/Utils/async-handler';

@injectable()
export class OwnerRoutes extends BaseRoute {
    constructor(private readonly _controller: OwnerVerificationController) {
        super();
        this.initializeRoutes();
    }
    protected initializeRoutes(): void {
        this.router.post(
            OWNER_ROUTES.SUBMIT,
            authMiddleware,
            neededRole(UserRole.OWNER),
            upload.single('document'),
            validationRequestMiddleware(submitVerificationSchema),
            asyncHandlerFunction(this._controller.submit),
        );
        this.router.get(
            OWNER_ROUTES.STATUS,
            authMiddleware,
            asyncHandlerFunction(this._controller.getStatus),
        );
    }
}
