import { injectable } from 'tsyringe';
import { UserRegisterController } from '@presentation/Controllers/Authentication/Register_user.controller';
import { VerifyOtpController } from '@presentation/Controllers/Authentication/VerifyOtp.controller';
import { BaseRoute } from '../Base/base.route';
import { asyncHandlerFunction } from '@presentation/Utils/asyncHandler';
import { ResendOtpController } from '@presentation/Controllers/Authentication/ResendOtp.controller';
import { LoginController } from '@presentation/Controllers/Authentication/Login.controller';
import { ForgotPasswordController } from '@presentation/Controllers/Authentication/ForgotPassword.controller';
import { VerifyResetOtpController } from '@presentation/Controllers/Authentication/VerifyResetOtp.controller';
import { ResetPasswordController } from '@presentation/Controllers/Authentication/ResetPassword.controller';
import { GoogleAuthControler } from '@presentation/Controllers/Authentication/GoogleAuth.controller';

@injectable()
export class UserRoutes extends BaseRoute {
  constructor(
    private readonly userRegisterController: UserRegisterController,
    private readonly verifyOtpController: VerifyOtpController,
    private readonly resendOtpControler: ResendOtpController,
    private readonly loginController: LoginController,
    private readonly forgotPassController: ForgotPasswordController,
    private readonly verifyResetOtpController: VerifyResetOtpController,
    private readonly resetPasswordController: ResetPasswordController,
    private readonly googleAuthController: GoogleAuthControler
  ) {
    super();
    this.initializeRoutes();
  }
  protected initializeRoutes(): void {
    this.router.post('/register', asyncHandlerFunction(this.userRegisterController.register.bind(this.userRegisterController)))
    this.router.post('/verify-otp', asyncHandlerFunction(this.verifyOtpController.verify.bind(this.verifyOtpController)))
    this.router.post('/resend-otp', asyncHandlerFunction(this.resendOtpControler.resend.bind(this.resendOtpControler)))
    this.router.post('/login', asyncHandlerFunction(this.loginController.login.bind(this.loginController)))
    this.router.post('/forgot-password', asyncHandlerFunction(this.forgotPassController.execute.bind(this.forgotPassController)))
    this.router.post('/verify-reset-otp', asyncHandlerFunction(this.verifyResetOtpController.execute.bind(this.verifyResetOtpController)))
    this.router.post('/reset-password', asyncHandlerFunction(this.resetPasswordController.execute.bind(this.resetPasswordController)))
    this.router.post('/google-auth', asyncHandlerFunction(this.googleAuthController.execute.bind(this.googleAuthController)))
  }
}
