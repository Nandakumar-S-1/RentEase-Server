import { ILoginUserUseCase } from '@application/Interfaces/Auth/ILoginUserUseCase';
import { TokenTypes } from '@shared/Types/tokens';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { logger } from '@shared/Log/logger';
import { Http_StatusCodes } from '@shared/Enums/Http_StatusCodes';
import { ApiResponse } from '@application/Data-Transfer-Object/ApiResponseDTO';
import { UserRole } from '@shared/Enums/user.role.type';

@injectable()
export class AdminLoginController {
    constructor(
        @inject(TokenTypes.ILoginUseCase)
        private readonly loginUseCase: ILoginUserUseCase,
    ) {}

    async login(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
        logger.info(`adminlogin: ${email}`);

        const result = await this.loginUseCase.execute({
            email,
            password,
        });

        if (result.user.role !== UserRole.ADMIN) {
            return res.status(Http_StatusCodes.FORBIDDEN).json({
                success: false,
                message: 'Access denied. Only administrators can log in here.',
            });
        }

        const response: ApiResponse<{
            user: {
                id: string;
                email: string;
                fullname: string;
                phone: string | null;
                role: string;
            };
            accessToken: string;
            refreshToken: string;
        }> = {
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

        return res.status(Http_StatusCodes.OK).json(response);
    }
}
