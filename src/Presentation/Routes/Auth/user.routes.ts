import { injectable } from 'tsyringe';
import { UserRegisterController } from '@presentation/Controllers/Authentication/Register_user.controller';
import { BaseRoute } from '../Base/base.route';

@injectable()
export class UserRoutes extends BaseRoute {
  constructor(private readonly userRegisterController: UserRegisterController) {
    super();
    this.initializeRoutes();
  }
  protected initializeRoutes(): void {
    this.router.post('/register', (req, res) => this.userRegisterController.register(req, res));
  }
}
