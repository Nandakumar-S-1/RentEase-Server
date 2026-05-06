import {
    IVerifyPropertyUseCase,
    PaginatedPropertyResponse,
} from '@application/interfaces/property/property.usecase.interface';
import { PropertyResponseMapper } from '@application/mappers/property/property-response.mapper';
import { IPropertyRepository } from '@core/interfaces/repository/property-repository.interface';
import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import { PropertyNotFoundError } from '@shared/errors/property-errors';
import { PropertyStatus } from '@shared/enums/property-type-status.enum';

@injectable()
export class VerifyPropertyUseCase implements IVerifyPropertyUseCase {
    constructor(
        @inject(TokenTypes.IPropertyRepository)
        private readonly _propertyRepo: IPropertyRepository,
    ) {}

    async getPendingProperties(page: number, limit: number): Promise<PaginatedPropertyResponse> {
        const skip = (page - 1) * limit;
        const [pendingProperties, total] = await Promise.all([
            this._propertyRepo.findPending(skip, limit),
            this._propertyRepo.countAll(PropertyStatus.PENDING_APPROVAL),
        ]);

        return {
            properties: pendingProperties.map((property) =>
                PropertyResponseMapper.toGeneralResponse(property),
            ),
            total,
            page,
            limit,
        };
    }

    async getAllProperties(
        status: PropertyStatus,
        page: number,
        limit: number,
    ): Promise<PaginatedPropertyResponse> {
        const skip = (page - 1) * limit;
        const [properties, total] = await Promise.all([
            this._propertyRepo.findAll(status, skip, limit),
            this._propertyRepo.countAll(status),
        ]);

        return {
            properties: properties.map((property) =>
                PropertyResponseMapper.toGeneralResponse(property),
            ),
            total,
            page,
            limit,
        };
    }

    async approveProperty(propertyId: string, adminId: string): Promise<void> {
        const property = await this._propertyRepo.findById(propertyId);
        if (!property) {
            throw new PropertyNotFoundError();
        }

        property.approve(adminId);
        await this._propertyRepo.update(property);
    }

    async rejectProperty(propertyId: string, reason?: string): Promise<void> {
        const property = await this._propertyRepo.findById(propertyId);
        if (!property) {
            throw new PropertyNotFoundError();
        }

        property.reject(reason);
        await this._propertyRepo.update(property);
    }
}
