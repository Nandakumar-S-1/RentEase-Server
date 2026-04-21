import { CreatePropertyDTO } from '@application/dtos/property/property.dto';
import { CreatePropertyResponseDTO } from '@application/dtos/property/res/create-property-response.dto';
import { ICreatePropertyUseCase } from '@application/interfaces/property/property.usecase.interface';
import { PropertyResponseMapper } from '@application/mappers/property/property-response.mapper';
import { PropertyMapper } from '@application/mappers/property/property.mapper';
import { IPropertyRepository } from '@core/interfaces/repository/property-repository.interface';
import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreatePropertyUseCase implements ICreatePropertyUseCase {
    constructor(
        @inject(TokenTypes.IPropertyRepository)
        private readonly _propertyRepo: IPropertyRepository,
    ) {}
    async execute(dto: CreatePropertyDTO): Promise<CreatePropertyResponseDTO> {
        const entity = PropertyMapper.toEntity(dto);
        const createdProperty = await this._propertyRepo.create(entity);
        return PropertyResponseMapper.toCreateResponse(createdProperty);
    }
}
