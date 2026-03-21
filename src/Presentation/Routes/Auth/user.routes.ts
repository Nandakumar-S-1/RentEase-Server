import { injectable } from 'tsyringe';
import { BaseRoute } from '../Base/base.route';
import { asyncHandlerFunction } from '@presentation/Utils/asyncHandler';
import { AuthController } from '@presentation/Controllers/Authentication/Auth.Controller';
import { AUTH_ROUTES } from '@shared/Constants/Routes';
import { validationRequestMiddleware } from '@presentation/Middlewares/Validation.middleware';
import {
  registerSchema, loginSchema, verifyOtpSchema,
  resendOtpSchema, forgotPassSchema, updatePassSchema,
  verifyResetOtpSchema, googleAuthSchema, refreshTokenSchema
} from '@application/Validators/auth.validators';

@injectable()
export class UserRoutes extends BaseRoute {
  constructor(
    private readonly _authController: AuthController
  ) {
    super();
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    // register & login
    this.router.post(AUTH_ROUTES.REGISTER, validationRequestMiddleware(registerSchema), asyncHandlerFunction(this._authController.register.bind(this._authController)));
    this.router.post(AUTH_ROUTES.LOGIN, validationRequestMiddleware(loginSchema), asyncHandlerFunction(this._authController.login.bind(this._authController)));
    this.router.post(AUTH_ROUTES.GOOGLE_AUTH, validationRequestMiddleware(googleAuthSchema), asyncHandlerFunction(this._authController.googleAuth.bind(this._authController)));
    this.router.post(AUTH_ROUTES.REFRESH_TOKEN, validationRequestMiddleware(refreshTokenSchema), asyncHandlerFunction(this._authController.refreshToken.bind(this._authController)));

    // OTP verify
    this.router.post(AUTH_ROUTES.VERIFY_OTP, validationRequestMiddleware(verifyOtpSchema), asyncHandlerFunction(this._authController.verifyOtp.bind(this._authController)));
    this.router.post(AUTH_ROUTES.RESEND_OTP, validationRequestMiddleware(resendOtpSchema), asyncHandlerFunction(this._authController.resendOtp.bind(this._authController)));

    // pw reset 
    this.router.post(AUTH_ROUTES.FORGOT_PASSWORD, validationRequestMiddleware(forgotPassSchema), asyncHandlerFunction(this._authController.forgotPassword.bind(this._authController)));
    this.router.post(AUTH_ROUTES.VERIFY_RESET_OTP, validationRequestMiddleware(verifyResetOtpSchema), asyncHandlerFunction(this._authController.verifyResetOtp.bind(this._authController)));
    this.router.post(AUTH_ROUTES.RESET_PASSWORD, validationRequestMiddleware(updatePassSchema), asyncHandlerFunction(this._authController.resetPassword.bind(this._authController)));
  }
}
