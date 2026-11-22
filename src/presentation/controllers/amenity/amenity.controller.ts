import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { TokenTypes } from '@shared/types/tokens';
import { asyncHandlerFunction } from '../../utils/async-handler';
import { ICreateAmenityUseCase, IUpdateAmenityUseCase, IDeleteAmenityUseCase, IGetAmenitiesUseCase } from '@application/interfaces/amenity/amenity.usecase.interface';

@injectable()
export class AmenityController {
    constructor(
        @inject(TokenTypes.ICreateAmenityUseCase) private createUseCase: ICreateAmenityUseCase,
        @inject(TokenTypes.IUpdateAmenityUseCase) private updateUseCase: IUpdateAmenityUseCase,
        @inject(TokenTypes.IDeleteAmenityUseCase) private deleteUseCase: IDeleteAmenityUseCase,
        @inject(TokenTypes.IGetAmenitiesUseCase) private getUseCase: IGetAmenitiesUseCase
    ) {}

    createAmenity = asyncHandlerFunction(async (req: Request, res: Response, next: NextFunction) => {
        if (!req.body.name) {
             res.status(400).json({ success: false, message: 'Name is required' });
             return;
        }
        const amenity = await this.createUseCase.execute(req.body);
        res.status(201).json({ success: true, data: amenity });
    });

    updateAmenity = asyncHandlerFunction(async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id as string;
        const amenity = await this.updateUseCase.execute(id, req.body);
        res.status(200).json({ success: true, data: amenity });
    });

    deleteAmenity = asyncHandlerFunction(async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id as string;
        await this.deleteUseCase.execute(id);
        res.status(200).json({ success: true, message: 'Amenity deleted' });
    });

    getAmenities = asyncHandlerFunction(async (req: Request, res: Response, next: NextFunction) => {
        const amenities = await this.getUseCase.execute();
        res.status(200).json({ success: true, data: amenities });
    });
}
