import { injectable } from 'tsyringe';
import { BaseRoute } from '../base/base.route';
import { asyncHandlerFunction } from 'presentation/Utils/async-handler';
import { AuthController } from 'presentation/controllers/authentication/auth.controller';
import { AUTH_ROUTES } from 'shared/constants/routes';
import { validationRequestMiddleware } from 'presentation/middlewares/validation.middleware';
import { authMiddleware } from 'presentation/middlewares/auth.middleware';
import {
    registerSchema,
    loginSchema,
    verifyOtpSchema,
    resendOtpSchema,
    forgotPassSchema,
    updatePassSchema,
    verifyResetOtpSchema,
    googleAuthSchema,
    refreshTokenSchema,
} from 'application/validators/auth.validators';
import { authLimiter } from 'presentation/middlewares/rate-limiter';

@injectable()
export class UserRoutes extends BaseRoute {
    constructor(private readonly _authController: AuthController) {
        super();
        this.initializeRoutes();
    }

    protected initializeRoutes(): void {
        // register & login
        this.router.post(
            AUTH_ROUTES.REGISTER,
            authLimiter,
            validationRequestMiddleware(registerSchema),
            asyncHandlerFunction(this._authController.register.bind(this._authController)),
        );
        this.router.post(
            AUTH_ROUTES.LOGIN,
            authLimiter,
            validationRequestMiddleware(loginSchema),
            asyncHandlerFunction(this._authController.login.bind(this._authController)),
        );
        this.router.post(
            AUTH_ROUTES.GOOGLE_AUTH,
            authLimiter,
            validationRequestMiddleware(googleAuthSchema),
            asyncHandlerFunction(this._authController.googleAuth.bind(this._authController)),
        );
        this.router.post(
            AUTH_ROUTES.REFRESH_TOKEN,
            validationRequestMiddleware(refreshTokenSchema),
            asyncHandlerFunction(this._authController.refreshToken.bind(this._authController)),
        );
        this.router.get(
            AUTH_ROUTES.ME,
            authMiddleware,
            asyncHandlerFunction(this._authController.getMe.bind(this._authController)),
        );

        // OTP verify
        this.router.post(
            AUTH_ROUTES.VERIFY_OTP,
            authLimiter,
            validationRequestMiddleware(verifyOtpSchema),
            asyncHandlerFunction(this._authController.verifyOtp.bind(this._authController)),
        );
        this.router.post(
            AUTH_ROUTES.RESEND_OTP,
            authLimiter,
            validationRequestMiddleware(resendOtpSchema),
            asyncHandlerFunction(this._authController.resendOtp.bind(this._authController)),
        );

        // pw reset
        this.router.post(
            AUTH_ROUTES.FORGOT_PASSWORD,
            authLimiter,
            validationRequestMiddleware(forgotPassSchema),
            asyncHandlerFunction(this._authController.forgotPassword.bind(this._authController)),
        );
        this.router.post(
            AUTH_ROUTES.VERIFY_RESET_OTP,
            validationRequestMiddleware(verifyResetOtpSchema),
            asyncHandlerFunction(this._authController.verifyResetOtp.bind(this._authController)),
        );
        this.router.post(
            AUTH_ROUTES.RESET_PASSWORD,
            validationRequestMiddleware(updatePassSchema),
            asyncHandlerFunction(this._authController.resetPassword.bind(this._authController)),
        );
    }
}
