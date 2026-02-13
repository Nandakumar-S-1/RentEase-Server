import { container, injectable } from 'tsyringe';
import { UserRegisterController } from '@presentation/Controllers/Authentication/Register_user.controller';
import { BaseRoute } from '../Base/base.route';

@injectable()
export class AuthRoutes extends BaseRoute{
    private _userRegisterController:UserRegisterController;

    constructor(){
        super()
        this._userRegisterController=container.resolve(UserRegisterController);
    }
    protected initializeRoutes():void{
        this.router.post(
            '/register',
            this._userRegisterController.register.bind(this._userRegisterController)
        )
    }
}