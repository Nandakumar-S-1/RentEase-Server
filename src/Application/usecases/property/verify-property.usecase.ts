import { IVerifyPropertyUseCase } from '@application/interfaces/property/property.usecase.interface';
import { PropertyResponseMapper } from '@application/mappers/property/property-response.mapper';
import { IPropertyRepository } from '@core/interfaces/repository/property-repository.interface';
import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import { PropertyNotFoundError } from '@shared/errors/property-errors';

@injectable()
export class VerifyPropertyUseCase implements IVerifyPropertyUseCase {
    constructor(
        @inject(TokenTypes.IPropertyRepository)
        private readonly _propertyRepo: IPropertyRepository,
    ) {}

    async getPendingProperties(): Promise<any[]> {
        const pendingProperties = await this._propertyRepo.findPending();
        return pendingProperties.map((property) =>
            PropertyResponseMapper.toGeneralResponse(property),
        );
    }

    async approveProperty(propertyId: string, adminId: string): Promise<void> {
        const property = await this._propertyRepo.findById(propertyId);
        if (!property) {
            throw new PropertyNotFoundError();
        }

        property.approve(adminId);
        await this._propertyRepo.update(property);
    }

    async rejectProperty(propertyId: string): Promise<void> {
        const property = await this._propertyRepo.findById(propertyId);
        if (!property) {
            throw new PropertyNotFoundError();
        }

        property.reject();
        await this._propertyRepo.update(property);
    }
}
