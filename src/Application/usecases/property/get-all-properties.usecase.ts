import { IPropertyRepository } from '@core/interfaces/repository/property-repository.interface';
import {
    GetAllPropertiesDTO,
    IGetAllPropertiesUseCase,
    PaginatedPropertyResponse,
} from '@application/interfaces/property/property.usecase.interface';
import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';
import { PropertyResponseMapper } from '@application/mappers/property/property-response.mapper';

@injectable()
export class GetAllPropertiesUseCase implements IGetAllPropertiesUseCase {
    constructor(
        @inject(TokenTypes.IPropertyRepository)
        private readonly _propertyRepository: IPropertyRepository,
    ) {}

    async execute(dto: GetAllPropertiesDTO): Promise<PaginatedPropertyResponse> {
        const { status, page, limit } = dto;
        const skip = (page - 1) * limit;

        const [properties, total] = await Promise.all([
            this._propertyRepository.findAll(status, skip, limit),
            this._propertyRepository.countAll(status),
        ]);

        return {
            properties: properties.map(PropertyResponseMapper.toGeneralResponse),
            total,
            page,
            limit,
        };
    }
}
