import { CreatePropertyDTO } from '@application/dtos/property/property.dto';
import { IUpdatePropertyUseCase } from '@application/interfaces/property/property.usecase.interface';
import { PropertyResponseMapper } from '@application/mappers/property/property-response.mapper';
import { IPropertyRepository } from '@core/interfaces/repository/property-repository.interface';
import { PropertyTypeData } from '@core/types/property.types';
import { PropertyNotFoundError } from '@shared/errors/property-errors';
import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UpdatePropertyUseCase implements IUpdatePropertyUseCase {
    constructor(
        @inject(TokenTypes.IPropertyRepository)
        private readonly _propertyRepo: IPropertyRepository,
    ) {}

    async execute(id: string, dto: Partial<CreatePropertyDTO>): Promise<PropertyTypeData> {
        const property = await this._propertyRepo.findById(id);

        if (!property) {
            throw new PropertyNotFoundError();
        }
        //to update the entity here ,passes the dto to the entity update method
        property.update(dto as unknown as Partial<PropertyTypeData>);

        const updatedProperty = await this._propertyRepo.update(property);

        return PropertyResponseMapper.toGeneralResponse(updatedProperty);
    }
}
