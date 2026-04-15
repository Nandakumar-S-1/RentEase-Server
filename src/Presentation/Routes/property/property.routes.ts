import { injectable } from "tsyringe";
import { BaseRoute } from "../base/base.route";
import { PropertyController } from "@presentation/controllers/property/property.controller";
import { authMiddleware } from "@presentation/middlewares/auth.middleware";
import { neededRole } from "@presentation/middlewares/role.middleware";
import { UserRole } from "@shared/enums/user-role.enum";
import { asyncHandlerFunction } from "@presentation/Utils/async-handler";
import { PROPERTY_ROUTES } from "@shared/constants/routes";

@injectable()
export class PropertyRoutes extends BaseRoute{
    constructor(private readonly _controller:PropertyController){
        super()
        this.initializeRoutes()
    }
    protected initializeRoutes(): void {
        this.router.post(
            PROPERTY_ROUTES.CREATE,
            authMiddleware,
            neededRole(UserRole.OWNER),
            asyncHandlerFunction(
                this._controller.createProperty.bind(this._controller)
            )
        )

        this.router.get(
            PROPERTY_ROUTES.GET_BY_OWNER,
            authMiddleware,
            neededRole(UserRole.OWNER),
            asyncHandlerFunction(
                this._controller.getMyProperties.bind(this._controller)
            )
        )
    }
}