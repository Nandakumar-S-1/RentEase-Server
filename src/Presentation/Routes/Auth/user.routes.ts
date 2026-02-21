import { injectable } from 'tsyringe';
import { UserRegisterController } from '@presentation/Controllers/Authentication/Register_user.controller';
import { VerifyOtpController } from '@presentation/Controllers/Authentication/VerifyOtp.controller';
import { BaseRoute } from '../Base/base.route';
import { asyncHandlerFunction } from '@presentation/Utils/asyncHandler';
import { ResendOtpController } from '@presentation/Controllers/Authentication/ResendOtp.controller';

@injectable()
export class UserRoutes extends BaseRoute {
  constructor(
    private readonly userRegisterController: UserRegisterController,
    private readonly verifyOtpController: VerifyOtpController,
    private readonly resendOtpControler:ResendOtpController
  ) {
    super();
    this.initializeRoutes();
  }
  protected initializeRoutes(): void {
    this.router.post('/register', asyncHandlerFunction(this.userRegisterController.register.bind(this.userRegisterController)))
    this.router.post('/verify-otp',asyncHandlerFunction(this.verifyOtpController.verify.bind(this.verifyOtpController)))
    this.router.post('/resend-otp',asyncHandlerFunction(this.resendOtpControler.resend.bind(this.resendOtpControler)))
  }
}
