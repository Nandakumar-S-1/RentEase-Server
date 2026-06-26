import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { TokenTypes } from '@shared/types/tokens';
import {
    ICreateMaintenanceRequestUseCase,
    IGetMaintenanceRequestsUseCase,
    IAssignServiceProviderUseCase,
    IUpdateMaintenanceStatusUseCase,
} from '@application/interfaces/maintenance/maintenance.usecase.interface';
import { ProjectErrors } from '@shared/errors/base/base.error';

@injectable()
export class MaintenanceController {
    constructor(
        @inject(TokenTypes.ICreateMaintenanceRequestUseCase)
        private readonly _createRequestUseCase: ICreateMaintenanceRequestUseCase,
        @inject(TokenTypes.IGetMaintenanceRequestsUseCase)
        private readonly _getRequestsUseCase: IGetMaintenanceRequestsUseCase,
        @inject(TokenTypes.IAssignServiceProviderUseCase)
        private readonly _assignProviderUseCase: IAssignServiceProviderUseCase,
        @inject(TokenTypes.IUpdateMaintenanceStatusUseCase)
        private readonly _updateStatusUseCase: IUpdateMaintenanceStatusUseCase,
    ) {}

    async createRequest(req: Request, res: Response): Promise<void> {
        try {
            const tenantId = req.user!.id;
            const data = req.body;
            const request = await this._createRequestUseCase.execute(tenantId, data);
            res.status(201).json({ success: true, data: request });
        } catch (error: unknown) {
            if (error instanceof ProjectErrors) {
                res.status(error.statusCode).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        }
    }

    async getRequests(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const role = req.user!.role;
            const requests = await this._getRequestsUseCase.execute(userId, role);
            res.status(200).json({ success: true, data: requests });
        } catch (error: unknown) {
            if (error instanceof ProjectErrors) {
                res.status(error.statusCode).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        }
    }

    async assignProvider(req: Request, res: Response): Promise<void> {
        try {
            const ownerId = req.user!.id;
            const { id } = req.params;
            const { providerId } = req.body;
            const request = await this._assignProviderUseCase.execute({
                requestId: id as string,
                providerId,
                ownerId,
            });
            res.status(200).json({ success: true, data: request });
        } catch (error: unknown) {
            if (error instanceof ProjectErrors) {
                res.status(error.statusCode).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        }
    }

    async updateStatus(req: Request, res: Response): Promise<void> {
        try {
            const ownerId = req.user!.id;
            const { id } = req.params;
            const { status } = req.body;
            const request = await this._updateStatusUseCase.execute({
                requestId: id as string,
                status,
                ownerId,
            });
            res.status(200).json({ success: true, data: request });
        } catch (error: unknown) {
            if (error instanceof ProjectErrors) {
                res.status(error.statusCode).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        }
    }
}
