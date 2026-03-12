import { inject, injectable } from 'tsyringe';
import { TokenTypes } from '../../../Shared/Types/tokens';
import { Request, Response } from 'express';
import { ICreateUserUseCase } from '@application/Interfaces/Auth/ICreateUserUseCase';
import { IVerifyOtpUseCase } from '@application/Interfaces/Auth/IVerifyOtpUseCase ';
import { logger } from '@shared/Log/logger';
import { ApiResponse } from '@application/Data-Transfer-Object/ApiResponseDTO';
import { Http_StatusCodes } from '@shared/Enums/Http_StatusCodes';
import { LoginResponseDTO } from '@application/Data-Transfer-Object/Authentication/Response/LoginResponseDTO';
import { Auth_Response_Messages } from '@shared/Types/Messages/Response.messages';
import { ILoginUserUseCase } from '@application/Interfaces/Auth/ILoginUserUseCase';
import { IResendOtpUseCase } from '@application/Interfaces/Auth/IResendOtpUseCase';
import { IRedisCache } from '@application/Interfaces/Services/IRedisCacheService';
import { ResendOtpResponseDTO } from '@application/Data-Transfer-Object/Authentication/Response/ResendOtpResponseDTO';
import { IForgotPasswordUseCase } from '@application/Interfaces/Auth/IForgotPasswordUseCase';
import { IHashService } from '@application/Interfaces/Services/IHashService';
import { IUserRepository } from '@core/Interfaces/IUserRepository';

@injectable()
export class AuthController {
    constructor(
        @inject(TokenTypes.IUserRepository)
        private readonly _userRepository:IUserRepository,

        @inject(TokenTypes.ICreateUserUseCase)
        private readonly _createUserUseCase: ICreateUserUseCase,

        @inject(TokenTypes.IVerifyOtpUseCase)
        private readonly _verifyOtpUseCase: IVerifyOtpUseCase,

        @inject(TokenTypes.IResendOtpUseCase)
        private readonly _resendOtpUseCase: IResendOtpUseCase,

        @inject(TokenTypes.IForgotPasswordUseCase)
        private readonly _forgotPasswordUsecase: IForgotPasswordUseCase,

        @inject(TokenTypes.IHashService)
        private readonly _hashService:IHashService,

        @inject(TokenTypes.IRedisCache)
        private readonly _redisService: IRedisCache,

        @inject(TokenTypes.ILoginUseCase)
        private readonly _loginUseCase: ILoginUserUseCase
    ) { }

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
        return res.status(Http_StatusCodes.CREATED).json(response)
    };

    verifyOtp = async (req: Request, res: Response): Promise<Response> => {
        const { email, otp } = req.body
        logger.info(`otp verification req is done on this ${email}`)

        const result = await this._verifyOtpUseCase.execute({
            email, otp
        })

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
                refreshToken: result.refreshToken,
            }
        }
        return res.status(Http_StatusCodes.OK).json(response)
    }

    resendOtp = async (req: Request, res: Response): Promise<Response> => {
        const { email } = req.body
        logger.info('resend otp req')
        const result = await this._resendOtpUseCase.execute({ email })

        const response: ApiResponse<ResendOtpResponseDTO> = {
            success: true,
            message: result.message,
            data: result
        }
        return res.status(Http_StatusCodes.OK).json(response)
    }

    forgotPassword = async (req: Request, res: Response): Promise<Response> => {
        const { email } = req.body
        logger.info('req for forgot password')

        await this._forgotPasswordUsecase.execute({ email })

        const response: ApiResponse<null> = {
            success: true,
            message: Auth_Response_Messages.PASSWORD_RESET_OTP_SENT
        }
        return res.status(Http_StatusCodes.OK).json(response)
    }

    resetPassword = async(req:Request,res:Response):Promise<Response>=>{
        const {email,newPassword}=req.body
        logger.info(`Password reset requested for: ${email}`)

        const isVerified = await this._redisService.get(
             `resetPassword_verified:${email}`            
        )

        if(!isVerified){
            throw new Error('otp should be verified first')
        }
        const user = await this._userRepository.findByEmail(email)
        if(!user){
            throw new Error('User not found')
        }

        const hashedPassword = await this._hashService.hash(newPassword)
        user.setPassword(hashedPassword)

        await this._userRepository.update(user.id,user)
        await this._redisService.delete(`resetPassword_verified:${email}`)

        logger.info('password reset was succesful')
        const response:ApiResponse<null>={
            success:true,
            message:Auth_Response_Messages.PASSWORD_RESET_SUCCESS
        }
        return res.send(Http_StatusCodes.OK).json(response)
    }

    login = async (req: Request, res: Response): Promise<Response> => {
        logger.info('login request')
        const { email, password } = req.body

        const result = await this._loginUseCase.execute({
            email, password
        })
        const response: ApiResponse<LoginResponseDTO> = {
            success: true,
            message: Auth_Response_Messages.LOGIN_SUCCESS,
            data: {
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    fullname: result.user.fullname,
                    phone: result.user.phone,
                    role: result.user.role
                },
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            }
        }
        return res.status(Http_StatusCodes.OK).json(response)
    }


}
