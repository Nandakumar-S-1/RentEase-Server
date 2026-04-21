import { inject, injectable } from 'tsyringe';
import { TokenTypes } from '../../../shared/types/tokens';
import { Request, Response } from 'express';
import { ICreateUserUseCase } from 'application/interfaces/auth/create-user.usecase.interface';
import { IVerifyOtpUseCase } from 'application/interfaces/auth/verify-otp.usecase.interface';
import { logger } from 'shared/log/logger';
import { Http_StatusCodes } from 'shared/enums/http-status-codes.enum';
import { Auth_Response_Messages } from 'shared/types/messages/Response.messages';
import { ILoginUserUseCase } from 'application/interfaces/auth/login-user.usecase.interface';
import { IResendOtpUseCase } from 'application/interfaces/auth/resend-otp.usecase.interface';
import { IRedisCache } from '@application/interfaces/services/redis-cache.service.interface';
import { IForgotPasswordUseCase } from 'application/interfaces/auth/forgot-password.usecase.interface';
import { IHashService } from '@application/interfaces/services/hash.service.interface';
import { IUserRepository } from '@core/interfaces/repository/user-repository.interface';
import { InvalidOtpError } from 'shared/errors/otp-errors';
import { IRefreshTokenUseCase } from 'application/interfaces/auth/refresh-token.usecase.interface';
import { clearRefreshTokenCookie, setRefreshTokenCookie } from 'shared/utils/cookieHelper';
import { ResponseHandler } from '@presentation/utils/response-handler';
import { UserMapper } from 'application/mappers/auth/user.mapper';
import { BadRequestError, NotFoundError } from 'shared/errors/common-errors';
import { IGoogleAuthUseCase } from '@application/interfaces/auth/google-auth.usecase.interface';
@injectable()
export class AuthController {
    constructor(
        @inject(TokenTypes.IUserRepository)
        private readonly _userRepository: IUserRepository,

        @inject(TokenTypes.ICreateUserUseCase)
        private readonly _createUserUseCase: ICreateUserUseCase,

        @inject(TokenTypes.IVerifyOtpUseCase)
        private readonly _verifyOtpUseCase: IVerifyOtpUseCase,

        @inject(TokenTypes.IResendOtpUseCase)
        private readonly _resendOtpUseCase: IResendOtpUseCase,

        @inject(TokenTypes.ILoginUseCase)
        private readonly _loginUseCase: ILoginUserUseCase,

        @inject(TokenTypes.IForgotPasswordUseCase)
        private readonly _forgotPasswordUsecase: IForgotPasswordUseCase,

        @inject(TokenTypes.IGoogleAuthUseCase)
        private readonly _googleAuthUseCase: IGoogleAuthUseCase,

        @inject(TokenTypes.IHashService)
        private readonly _hashService: IHashService,

        @inject(TokenTypes.IRedisCache)
        private readonly _redisService: IRedisCache,

        @inject(TokenTypes.IRefreshTokenUseCase)
        private readonly _refreshTokenUseCase: IRefreshTokenUseCase,
    ) { }

    register = async (req: Request, res: Response): Promise<Response> => {
        logger.info('registered data from the frontend is ', req.body);
        const user = await this._createUserUseCase.execute(req.body);
        const userData = UserMapper.toResponseDTO(user);

        return ResponseHandler.success(
            res,
            { user: userData },
            Auth_Response_Messages.REGISTER_SUCCESS,
            Http_StatusCodes.CREATED,
        );
    };

    login = async (req: Request, res: Response): Promise<Response> => {
        logger.info('login request init');
        const { email, password } = req.body;
        const result = await this._loginUseCase.execute({
            email,
            password,
        });
        logger.info(`user login with : ${email}`);
        const userData = UserMapper.toResponseDTO(result.user);

        setRefreshTokenCookie(res, result.refreshToken);

        return ResponseHandler.success(
            res,
            {
                user: userData,
                accessToken: result.accessToken,
            },
            Auth_Response_Messages.LOGIN_SUCCESS,
        );
    };

    googleAuth = async (req: Request, res: Response): Promise<Response> => {
        logger.info('Auth request for google auth');
        const { idToken, role } = req.body;

        const result = await this._googleAuthUseCase.execute({ idToken, role });
        const userData = UserMapper.toResponseDTO(result.user);

        setRefreshTokenCookie(res, result.refreshToken);

        return ResponseHandler.success(
            res,
            {
                user: userData,
                accessToken: result.accessToken,
            },
            Auth_Response_Messages.GOOGLE_LOGIN_SUCCESS,
        );
    };

    verifyOtp = async (req: Request, res: Response): Promise<Response> => {
        const { email, otp } = req.body;
        logger.info(`otp verification req is done on this ${email}`);

        const result = await this._verifyOtpUseCase.execute({
            email,
            otp,
        });
        const userData = UserMapper.toResponseDTO(result.user);

        setRefreshTokenCookie(res, result.refreshToken);

        return ResponseHandler.success(
            res,
            {
                user: userData,
                accessToken: result.accessToken,
            },
            Auth_Response_Messages.OTP_VERIFIED,
        );
    };

    resendOtp = async (req: Request, res: Response): Promise<Response> => {
        const { email } = req.body;
        logger.info('resend otp req');
        const result = await this._resendOtpUseCase.execute({ email });

        return ResponseHandler.success(res, result, result.message);
    };

    forgotPassword = async (req: Request, res: Response): Promise<Response> => {
        const { email } = req.body;
        logger.info('req for forgot password');

        await this._forgotPasswordUsecase.execute({ email });

        return ResponseHandler.success(
            res,
            null,
            Auth_Response_Messages.PASSWORD_RESET_OTP_SENT,
        );
    };

    verifyResetOtp = async (req: Request, res: Response): Promise<Response> => {
        const { email, otp } = req.body;
        logger.info('Verify reset otp');

        const redisKey = `resetPassword_otp:${email}`;
        const storedOtp = await this._redisService.get(redisKey);

        if (!storedOtp) {
            throw new InvalidOtpError(Auth_Response_Messages.OTP_EXPIRED);
        }
        if (storedOtp !== otp) {
            throw new InvalidOtpError(Auth_Response_Messages.INVALID_OTP);
        }
        await this._redisService.set(`resetPassword_verified:${email}`, 'true', 300);
        await this._redisService.delete(redisKey);

        return ResponseHandler.success(res, null, Auth_Response_Messages.OTP_VERIFIED);
    };

    resetPassword = async (req: Request, res: Response): Promise<Response> => {
        const { email, newPassword } = req.body;
        logger.info(`password reset requested for mail: ${email}`);

        const isVerified = await this._redisService.get(`resetPassword_verified:${email}`);

        if (!isVerified) {
            throw new BadRequestError(Auth_Response_Messages.OTP_REQUIRED);
        }
        const user = await this._userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundError(Auth_Response_Messages.USER_NOT_FOUND);
        }

        const hashedPassword = await this._hashService.hash(newPassword);
        user.setPassword(hashedPassword);

        await this._userRepository.update(user.id, user);
        await this._redisService.delete(`resetPassword_verified:${email}`);

        logger.info('password reset was succesful');
        return ResponseHandler.success(
            res,
            null,
            Auth_Response_Messages.PASSWORD_RESET_SUCCESS,
        );
    };

    refreshToken = async (req: Request, res: Response): Promise<Response> => {
        const refreshToken = req.cookies.refreshToken;

        logger.info(`refresh token requested ${!!refreshToken}`);
        if (!refreshToken) {
            return ResponseHandler.error(
                res,
                Auth_Response_Messages.MISSING_REFRESH_TOKEN,
                Http_StatusCodes.UN_AUTHORIZED,
            );
        }
        const tokens = await this._refreshTokenUseCase.execute(refreshToken);

        setRefreshTokenCookie(res, tokens.refreshToken);

        return ResponseHandler.success(
            res,
            { accessToken: tokens.accessToken },
            Auth_Response_Messages.TOKEN_REFRESHED,
        );
    };

    logout = async (_req: Request, res: Response): Promise<Response> => {
        clearRefreshTokenCookie(res);
        return ResponseHandler.success(res, null, Auth_Response_Messages.LOGOUT_SUCCESS);
    };

    getMe = async (req: Request, res: Response): Promise<Response> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userData = req.user ? UserMapper.toResponseDTO(req.user as any) : null;
        return ResponseHandler.success(
            res,
            { user: userData },
            Auth_Response_Messages.USER_AUTH_ACTIVE,
        );
    };
}
