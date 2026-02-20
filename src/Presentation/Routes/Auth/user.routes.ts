import { injectable } from 'tsyringe';
import { UserRegisterController } from '@presentation/Controllers/Authentication/Register_user.controller';
import { VerifyOtpController } from '@presentation/Controllers/Authentication/erifyOtp.controller';
import { BaseRoute } from '../Base/base.route';

@injectable()
export class UserRoutes extends BaseRoute {
  constructor(
    private readonly userRegisterController: UserRegisterController,
    private readonly verifyOtpController: VerifyOtpController,
  ) {
    super();
    this.initializeRoutes();
  }
  protected initializeRoutes(): void {
    this.router.post('/register', (req, res) => this.userRegisterController.register(req, res));
    this.router.post('/verify-otp', (req, res) => this.verifyOtpController.verify(req, res));
  }
}
