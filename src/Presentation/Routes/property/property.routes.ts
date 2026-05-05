import { injectable } from 'tsyringe';
import { BaseRoute } from '../base/base.route';
import { PropertyController } from '@presentation/controllers/property/property.controller';
import { authMiddleware } from '@presentation/middlewares/auth.middleware';
import { neededRole } from '@presentation/middlewares/role.middleware';
import { UserRole } from '@shared/enums/user-role.enum';
import { asyncHandlerFunction } from '@presentation/utils/async-handler';
import { PROPERTY_ROUTES } from '@shared/constants/routes';

import { validationRequestMiddleware } from '@presentation/middlewares/validation.middleware';
import { createPropertySchema, propertyFilterSchema } from '@application/validators/property.validators';

@injectable()
export class PropertyRoutes extends BaseRoute {
    constructor(private readonly _controller: PropertyController) {
        super();
        this.initializeRoutes();
    }
    protected initializeRoutes(): void {
        this.router.post(
            PROPERTY_ROUTES.UPLOAD_PHOTOS_URLS,
            authMiddleware,
            neededRole(UserRole.OWNER),
            asyncHandlerFunction(this._controller.uploadPropertyPhotoUrls.bind(this._controller)),
        );

        this.router.post(
            PROPERTY_ROUTES.CREATE,
            authMiddleware,
            neededRole(UserRole.OWNER),
            validationRequestMiddleware(createPropertySchema),
            asyncHandlerFunction(this._controller.createProperty.bind(this._controller)),
        );

        this.router.get(
            PROPERTY_ROUTES.LIST,
            validationRequestMiddleware(propertyFilterSchema, 'query'),
            asyncHandlerFunction(this._controller.getAllProperties.bind(this._controller)),
        );

        this.router.get(
            PROPERTY_ROUTES.GET_BY_OWNER,
            authMiddleware,
            neededRole(UserRole.OWNER),
            asyncHandlerFunction(this._controller.getMyProperties.bind(this._controller)),
        );

        this.router.get(
            PROPERTY_ROUTES.GET_BY_ID,
            asyncHandlerFunction(this._controller.getPropertyById.bind(this._controller)),
        );

        this.router.put(
            PROPERTY_ROUTES.UPDATE,
            authMiddleware,
            neededRole(UserRole.OWNER),
            asyncHandlerFunction(this._controller.updateProperty.bind(this._controller)),
        );

        this.router.patch(
            PROPERTY_ROUTES.UNLIST,
            authMiddleware,
            neededRole(UserRole.OWNER),
            asyncHandlerFunction(this._controller.unlistProperty.bind(this._controller)),
        );

        this.router.patch(
            PROPERTY_ROUTES.RELIST,
            authMiddleware,
            neededRole(UserRole.OWNER),
            asyncHandlerFunction(this._controller.relistProperty.bind(this._controller)),
        );

        this.router.delete(
            PROPERTY_ROUTES.DELETE,
            authMiddleware,
            neededRole(UserRole.OWNER),
            asyncHandlerFunction(this._controller.deleteProperty.bind(this._controller)),
        );
    }
}
