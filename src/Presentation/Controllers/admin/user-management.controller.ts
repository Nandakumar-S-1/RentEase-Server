import { ApiResponse } from 'application/dtos/api-response.dto';
import { IUserManagement } from 'application/interfaces/admin/user-management.interface';
import { Http_StatusCodes } from 'shared/enums/http-status-codes.enum';
import { TokenTypes } from 'shared/types/tokens';
import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import type { IGetAllUsersDTO } from 'application/dtos/admin/response/get-all-users-response.dto';

import { PropertyStatus } from '@shared/enums/property-type-status.enum';
import { IGetMyPropertiesUseCase, PaginatedPropertyResponse } from 'application/interfaces/property/property.usecase.interface';

type GetUsersResponseData = {
    users: IGetAllUsersDTO[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
};

@injectable()
export class UserManagementController {
    constructor(
        @inject(TokenTypes.UserManagementUseCase)
        private readonly _usecase: IUserManagement,
        @inject(TokenTypes.IGetMyPropertiesUseCase)
        private readonly _getPropertyUseCase: IGetMyPropertiesUseCase,
    ) {}

    async getUserProperties(req: Request, res: Response): Promise<Response> {
        const id = req.params.id as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as PropertyStatus;

        const result = await this._getPropertyUseCase.execute({
            ownerId: id,
            page,
            limit,
            status,
        });

        const response: ApiResponse<PaginatedPropertyResponse> = {
            success: true,
            message: 'Fetched user properties',
            data: result,
        };

        return res.status(Http_StatusCodes.OK).json(response);
    }

    async getAllUsers(req: Request, res: Response): Promise<Response> {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 9;
        const role = req.query.role as 'TENANT' | 'OWNER' | undefined;

        const result = await this._usecase.getUsers({ page, limit, role });
        const response: ApiResponse<GetUsersResponseData> = {
            success: true,
            message: 'Fetched users',
            data: {
                users: result.users,
                pagination: {
                    page,
                    limit,
                    total: result.total,
                    pages: Math.ceil(result.total / limit),
                },
            },
        };
        return res.status(Http_StatusCodes.OK).json(response);
    }

    async getUserById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const user = await this._usecase.getUserById(id as string);

        const response: ApiResponse<IGetAllUsersDTO> = {
            success: true,
            message: 'fetched user details',
            data: user,
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
