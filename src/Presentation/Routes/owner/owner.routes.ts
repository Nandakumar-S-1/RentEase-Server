import { injectable } from 'tsyringe';
import { BaseRoute } from '../Base/base.route';
import { OwnerVerificationController } from '@presentation/Controllers/Owner/OwnerVerification.controller';
import { OWNER_ROUTES } from '@shared/Constants/Routes';
import { authMiddleware } from '@presentation/Middlewares/Auth.middleware';
import { neededRole } from '@presentation/Middlewares/Role.middleware';
import { UserRole } from '@shared/Enums/user.role.type';
import { upload } from '@shared/Uploads/cloudinary.upload';
import { validationRequestMiddleware } from '@presentation/Middlewares/Validation.middleware';
import { submitVerificationSchema } from '@application/Validators/owner.validators';
import { asyncHandlerFunction } from '@presentation/Utils/asyncHandler';

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
        asyncHandlerFunction(this._controller.getStatus)
    )
  }

}
