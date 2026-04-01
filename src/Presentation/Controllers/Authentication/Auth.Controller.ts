import { inject, injectable } from 'tsyringe';
import { TokenTypes } from '../../../shared/types/tokens';
import { Request, Response } from 'express';
import { ICreateUserUseCase } from 'application/interfaces/auth/create-user.usecase.interface';
import { IVerifyOtpUseCase } from 'application/interfaces/auth/verify-otp.usecase.interface';
import { logger } from 'shared/log/logger';
import { ApiResponse } from 'application/dtos/api-response.dto';
import { Http_StatusCodes } from 'shared/enums/http-status-codes.enum';
import { LoginResponseDTO } from 'application/dtos/authentication/response/login-response.dto';
import { Auth_Response_Messages } from 'shared/types/messages/Response.messages';
import { ILoginUserUseCase } from 'application/interfaces/auth/login-user.usecase.interface';
import { IResendOtpUseCase } from 'application/interfaces/auth/resend-otp.usecase.interface';
import { IRedisCache } from 'application/interfaces/services/redis-cache.service.interface';
import { ResendOtpResponseDTO } from 'application/dtos/authentication/response/resend-otp-response.dto';
import { IForgotPasswordUseCase } from 'application/interfaces/auth/forgot-password.usecase.interface';
import { IHashService } from 'application/interfaces/services/hash.service.interface';
import { IUserRepository } from 'core/interfaces/user-repository.interface';
import { GoogleAuthUseCase } from 'application/usecases/auth/google-auth.usecase';
import { InvalidOtpError } from 'shared/errors/otp-errors';
import { IRefreshTokenUseCase } from 'application/interfaces/auth/refresh-token.usecase.interface';
import { RefreshTokenResponseDTO } from 'application/dtos/authentication/response/refresh-token-response.dto';
import { setRefreshTokenCookie } from 'shared/utils/cookieHelper';
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
        private readonly _googleAuthUseCase: GoogleAuthUseCase,

        @inject(TokenTypes.IHashService)
        private readonly _hashService: IHashService,

        @inject(TokenTypes.IRedisCache)
        private readonly _redisService: IRedisCache,

        @inject(TokenTypes.IRefreshTokenUseCase)
        private readonly _refreshTokenUseCase: IRefreshTokenUseCase,
    ) {}

    register = async (req: Request, res: Response): Promise<Response> => {
        logger.info('registered data from the frontend is ', req.body);
        const user = await this._createUserUseCase.execute(req.body);

        const response: ApiResponse<unknown> = {
            success: true,
            message: Auth_Response_Messages.REGISTER_SUCCESS,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    fullname: user.fullname,
                    phone: user.phone,
                    role: user.role,
                },
            },
        };
        return res.status(Http_StatusCodes.CREATED).json(response);
    };

    login = async (req: Request, res: Response): Promise<Response> => {
        logger.info('login request');
        const { email, password } = req.body;

        const result = await this._loginUseCase.execute({
            email,
            password,
        });
        const response: ApiResponse<LoginResponseDTO> = {
            success: true,
            message: Auth_Response_Messages.LOGIN_SUCCESS,
            data: {
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    fullname: result.user.fullname,
                    phone: result.user.phone,
                    role: result.user.role,
                },
                accessToken: result.accessToken,
            },
        };

        setRefreshTokenCookie(res, result.refreshToken);

        return res.status(Http_StatusCodes.OK).json(response);
    };

    googleAuth = async (req: Request, res: Response): Promise<Response> => {
        logger.info('Auth request for google auth');
        const { idToken, role } = req.body;

        const result = await this._googleAuthUseCase.execute({ idToken, role });

        const response: ApiResponse<LoginResponseDTO> = {
            success: true,
            message: Auth_Response_Messages.GOOGLE_LOGIN_SUCCESS,
            data: {
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    fullname: result.user.fullname,
                    phone: result.user.phone,
                    role: result.user.role,
                },
                accessToken: result.accessToken,
            },
        };

        setRefreshTokenCookie(res, result.refreshToken);

        return res.status(Http_StatusCodes.OK).json(response);
    };

    verifyOtp = async (req: Request, res: Response): Promise<Response> => {
        const { email, otp } = req.body;
        logger.info(`otp verification req is done on this ${email}`);

        const result = await this._verifyOtpUseCase.execute({
            email,
            otp,
        });

        const response: ApiResponse<LoginResponseDTO> = {
            success: true,
            message: Auth_Response_Messages.OTP_VERIFIED,
            data: {
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    fullname: result.user.fullname,
                    phone: result.user.phone,
                    role: result.user.role,
                },
                accessToken: result.accessToken,
            },
        };

        setRefreshTokenCookie(res, result.refreshToken);

        return res.status(Http_StatusCodes.OK).json(response);
    };

    resendOtp = async (req: Request, res: Response): Promise<Response> => {
        const { email } = req.body;
        logger.info('resend otp req');
        const result = await this._resendOtpUseCase.execute({ email });

        const response: ApiResponse<ResendOtpResponseDTO> = {
            success: true,
            message: result.message,
            data: result,
        };
        return res.status(Http_StatusCodes.OK).json(response);
    };

    forgotPassword = async (req: Request, res: Response): Promise<Response> => {
        const { email } = req.body;
        logger.info('req for forgot password');

        await this._forgotPasswordUsecase.execute({ email });

        const response: ApiResponse<null> = {
            success: true,
            message: Auth_Response_Messages.PASSWORD_RESET_OTP_SENT,
        };
        return res.status(Http_StatusCodes.OK).json(response);
    };

    verifyResetOtp = async (req: Request, res: Response): Promise<Response> => {
        const { email, otp } = req.body;
        logger.info('Verify reset otp');

        const redisKey = `resetPassword_otp:${email}`;
        const storedOtp = await this._redisService.get(redisKey);

        if (!storedOtp) {
            throw new InvalidOtpError('Otp Might be expired or not found');
        }
        if (storedOtp !== otp) {
            throw new InvalidOtpError('Invalid Otp, Try again');
        }
        await this._redisService.set(`resetPassword_verified:${email}`, 'true', 300);
        await this._redisService.delete(redisKey);

        const response: ApiResponse<null> = {
            success: true,
            message: Auth_Response_Messages.OTP_VERIFIED,
        };
        return res.status(Http_StatusCodes.OK).json(response);
    };

    resetPassword = async (req: Request, res: Response): Promise<Response> => {
        const { email, newPassword } = req.body;
        logger.info(`Password reset requested for: ${email}`);

        const isVerified = await this._redisService.get(`resetPassword_verified:${email}`);

        if (!isVerified) {
            throw new Error('otp should be verified first');
        }
        const user = await this._userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        const hashedPassword = await this._hashService.hash(newPassword);
        user.setPassword(hashedPassword);

        await this._userRepository.update(user.id, user);
        await this._redisService.delete(`resetPassword_verified:${email}`);

        logger.info('password reset was succesful');
        const response: ApiResponse<null> = {
            success: true,
            message: Auth_Response_Messages.PASSWORD_RESET_SUCCESS,
        };
        return res.status(Http_StatusCodes.OK).json(response);
    };

    refreshToken = async (req: Request, res: Response): Promise<Response> => {
        const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

        logger.info('Refresh Token request');
        if (!refreshToken) {
            return res.status(Http_StatusCodes.BAD_REQUEST).json({
                success: false,
                message: Auth_Response_Messages.MISSING_REFRESH_TOKEN,
            });
        }
        const tokens = await this._refreshTokenUseCase.execute(refreshToken);

        const response: ApiResponse<RefreshTokenResponseDTO> = {
            success: true,
            message: Auth_Response_Messages.TOKEN_REFRESHED,
            data: {
                accessToken: tokens.accessToken,
            },
        };

        setRefreshTokenCookie(res, tokens.refreshToken);

        return res.status(Http_StatusCodes.OK).json(response);
    };

    getMe = async (req: Request, res: Response): Promise<Response> => {
        return res.status(Http_StatusCodes.OK).json({
            success: true,
            message: 'User is authenticated and active',
            data: { user: req.user },
        });
    };
}
