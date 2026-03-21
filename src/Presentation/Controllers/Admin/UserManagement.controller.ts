import { ApiResponse } from "@application/Data-Transfer-Object/ApiResponseDTO";
import { UserManagementUseCase } from "@application/UseCases/Admin/UserManagement.usecase";
import { Http_StatusCodes } from "@shared/Enums/Http_StatusCodes";
import { TokenTypes } from "@shared/Types/tokens";
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserManagementController {
    constructor(
        @inject(TokenTypes.UserManagementUseCase)
        private readonly _usecase: UserManagementUseCase,

    ) { }

    async getAllUsers(req: Request, res: Response): Promise<Response> {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 9;
        const role = req.query.role as 'TENANT' | 'OWNER' | undefined;

        const result = await this._usecase.getUsers(page, limit, role);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: ApiResponse<any> = {
            success: true,
            message: 'Fetched users',
            data: {
                users: result.users,
                pagination: {
                    page,
                    limit,
                    total: result.total,
                    pages: Math.ceil(result.total / limit)
                }
            }
        };
        return res.status(Http_StatusCodes.OK).json(response);
    }

    async suspendUser(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        await this._usecase.suspendUser(id as string);

        const response: ApiResponse<null> = {
            success: true,
            message: 'User suspended successfully',
        };

        return res.status(Http_StatusCodes.OK).json(response);
    }

    async activateUser(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        await this._usecase.activateUser(id as string);

        const response: ApiResponse<null> = {
            success: true,
            message: 'User activated successfully',
        };

        return res.status(Http_StatusCodes.OK).json(response);
    }

    async deactivateUser(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        await this._usecase.deactivateUser(id as string);

        const response: ApiResponse<null> = {
            success: true,
            message: 'User deactivated successfully',
        };

        return res.status(Http_StatusCodes.OK).json(response);
    }

}