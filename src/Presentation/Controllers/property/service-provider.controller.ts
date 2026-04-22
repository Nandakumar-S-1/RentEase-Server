import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { logger } from '@shared/log/logger';
import { IServiceProviderUseCase } from '@application/interfaces/property/property.usecase.interface';
import { ResponseHandler } from '../../utils/response-handler';
import { Http_StatusCodes } from '@shared/enums/http-status-codes.enum';

@injectable()
export class ServiceProviderController {
    constructor(
        @inject(TokenTypes.IServiceProviderUseCase)
        private readonly _providerUseCase: IServiceProviderUseCase,
    ) {}

    addProvider = async (req: Request, res: Response): Promise<Response> => {
        logger.info(`adding service provider to property: ${req.body.propertyId}`);
        const result = await this._providerUseCase.addProvider(req.body);
        return ResponseHandler.success(
            res,
            result,
            'Service provider added successfully',
            Http_StatusCodes.CREATED,
        );
    };

    getProvidersByProperty = async (req: Request, res: Response): Promise<Response> => {
        const propertyId = req.params.propertyId as string;
        logger.info(`fetching providers for property: ${propertyId}`);
        const result = await this._providerUseCase.getProvidersByProperty(propertyId);
        return ResponseHandler.success(res, result, 'Service providers fetched successfully');
    };

    deleteProvider = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id as string;
        logger.info(`deleting service provider: ${id}`);
        await this._providerUseCase.deleteProvider(id);
        return ResponseHandler.success(res, null, 'Service provider deleted successfully');
    };

    toggleStatus = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id as string;
        const { isActive } = req.body;
        logger.info(`toggling service provider status: ${id} to ${isActive}`);
        await this._providerUseCase.toggleProviderStatus(id, isActive);
        return ResponseHandler.success(res, null, 'Status updated successfully');
    };
}
