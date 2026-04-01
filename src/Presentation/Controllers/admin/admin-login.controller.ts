import { ILoginUserUseCase } from 'application/interfaces/auth/login-user.usecase.interface';
import { IGoogleAuthUseCase } from 'application/interfaces/auth/google-auth.usecase.interface';
import { TokenTypes } from 'shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { logger } from 'shared/log/logger';
import { Http_StatusCodes } from 'shared/enums/http-status-codes.enum';
import { ApiResponse } from 'application/dtos/api-response.dto';
import { UserRole } from 'shared/enums/user-role.enum';
import { LoginResponseDTO } from 'application/dtos/authentication/response/login-response.dto';

@injectable()
export class AdminLoginController {
    constructor(
        @inject(TokenTypes.ILoginUseCase)
        private readonly _loginUseCase: ILoginUserUseCase,
        @inject(TokenTypes.IGoogleAuthUseCase)
        private readonly _googleAuthUseCase: IGoogleAuthUseCase,
    ) {}

    async login(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
        logger.info(`adminlogin: ${email}`);

        const result = await this._loginUseCase.execute({
            email,
            password,
        });

        if (result.user.role !== UserRole.ADMIN) {
            return res.status(Http_StatusCodes.FORBIDDEN).json({
                success: false,
                message: 'Access denied. Only administrators can log in here.',
            });
        }

        const response: ApiResponse<LoginResponseDTO> = {
            success: true,
            message: 'Admin login successful',
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
            },
        };

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(Http_StatusCodes.OK).json(response);
    }

    async googleLogin(req: Request, res: Response): Promise<Response> {
        const { idToken } = req.body;
        logger.info('admin google login request');

        const result = await this._googleAuthUseCase.execute({
            idToken,
            role: UserRole.ADMIN,
        });

        if (result.user.role !== UserRole.ADMIN) {
            return res.status(Http_StatusCodes.FORBIDDEN).json({
                success: false,
                message: 'Access denied. Only administrators can log in here.',
            });
        }

        const response: ApiResponse<LoginResponseDTO> = {
            success: true,
            message: 'Admin login successful',
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
            },
        };

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(Http_StatusCodes.OK).json(response);
    }
}
