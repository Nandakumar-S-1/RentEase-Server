import { injectable } from 'tsyringe';
import { BaseRoute } from '../Base/base.route';
import { asyncHandlerFunction } from '@presentation/Utils/asyncHandler';
import { AuthController } from '@presentation/Controllers/Authentication/Auth.Controller';
import { AUTH_ROUTES } from '@shared/Constants/Routes';
import { validationRequestMiddleware } from '@presentation/Middlewares/ValidationMiddleware';
import {
  registerSchema, loginSchema, verifyOtpSchema,
  resendOtpSchema, forgotPassSchema, updatePassSchema,
  verifyResetOtpSchema, googleAuthSchema, refreshTokenSchema
} from '@application/Validators/auth.validators';

@injectable()
export class UserRoutes extends BaseRoute {
  constructor(
    private readonly authController: AuthController
  ) {
    super();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    // register & login
    this.router.post(AUTH_ROUTES.REGISTER, validationRequestMiddleware(registerSchema), asyncHandlerFunction(this.authController.register.bind(this.authController)));
    this.router.post(AUTH_ROUTES.LOGIN, validationRequestMiddleware(loginSchema), asyncHandlerFunction(this.authController.login.bind(this.authController)));
    this.router.post(AUTH_ROUTES.GOOGLE_AUTH, validationRequestMiddleware(googleAuthSchema), asyncHandlerFunction(this.authController.googleAuth.bind(this.authController)));
    this.router.post(AUTH_ROUTES.REFRESH_TOKEN, validationRequestMiddleware(refreshTokenSchema), asyncHandlerFunction(this.authController.refreshToken.bind(this.authController)));

    // OTP verify
    this.router.post(AUTH_ROUTES.VERIFY_OTP, validationRequestMiddleware(verifyOtpSchema), asyncHandlerFunction(this.authController.verifyOtp.bind(this.authController)));
    this.router.post(AUTH_ROUTES.RESEND_OTP, validationRequestMiddleware(resendOtpSchema), asyncHandlerFunction(this.authController.resendOtp.bind(this.authController)));

    // pw reset 
    this.router.post(AUTH_ROUTES.FORGOT_PASSWORD, validationRequestMiddleware(forgotPassSchema), asyncHandlerFunction(this.authController.forgotPassword.bind(this.authController)));
    this.router.post(AUTH_ROUTES.VERIFY_RESET_OTP, validationRequestMiddleware(verifyResetOtpSchema), asyncHandlerFunction(this.authController.verifyResetOtp.bind(this.authController)));
    this.router.post(AUTH_ROUTES.RESET_PASSWORD, validationRequestMiddleware(updatePassSchema), asyncHandlerFunction(this.authController.resetPassword.bind(this.authController)));
  }
}
