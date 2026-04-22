import { IGetPropertyByIdUseCase } from '@application/interfaces/property/property.usecase.interface';
import { PropertyResponseMapper } from '@application/mappers/property/property-response.mapper';
import { IPropertyRepository } from '@core/interfaces/repository/property-repository.interface';
import { PropertyNotFoundError } from '@shared/errors/property-errors';
import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetPropertyByIdUseCase implements IGetPropertyByIdUseCase {
    constructor(
        @inject(TokenTypes.IPropertyRepository)
        private readonly _propertyRepo: IPropertyRepository,
    ) {}

    async execute(id: string): Promise<any> {
        const property = await this._propertyRepo.findById(id);

        if (!property) {
            throw new PropertyNotFoundError();
        }

        await this._propertyRepo.incrementViews(id);

        return PropertyResponseMapper.toGeneralResponse(property);
    }
}
