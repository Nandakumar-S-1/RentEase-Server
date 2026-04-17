import { injectable } from 'tsyringe';
import { BaseRoute } from '../base/base.route';
import { ProfileController } from 'presentation/controllers/profile/profile.controller';
import { PROFILE_ROUTES } from '@shared/constants/routes';
import { authMiddleware } from '@presentation/middlewares/temp';
import { validationRequestMiddleware } from '@presentation/middlewares/validation.middleware';
import { updateProfileSchema } from 'application/validators/profile.validators';
import { asyncHandlerFunction } from 'presentation/Utils/async-handler';
import { upload } from 'shared/uploads/cloudinary.upload';

@injectable()
export class ProfileRoutes extends BaseRoute {
    constructor(private readonly _controller: ProfileController) {
        super();
        this.initializeRoutes();
    }

    protected initializeRoutes(): void {
        this.router.get(
            PROFILE_ROUTES.GET,
            authMiddleware,
            asyncHandlerFunction(this._controller.getProfile.bind(this._controller)),
        );
        this.router.put(
            PROFILE_ROUTES.UPDATE,
            authMiddleware,
            validationRequestMiddleware(updateProfileSchema),
            asyncHandlerFunction(this._controller.updateProfile.bind(this._controller)),
        );
        this.router.post(
            PROFILE_ROUTES.AVATAR,
            authMiddleware,
            upload.single('avatar'),
            asyncHandlerFunction(this._controller.uploadAvatar.bind(this._controller)),
        );
    }
}
