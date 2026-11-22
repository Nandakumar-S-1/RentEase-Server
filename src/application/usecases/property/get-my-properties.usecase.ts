import {
    GetMyPropertiesDTO,
    IGetMyPropertiesUseCase,
    PaginatedPropertyResponse,
} from '@application/interfaces/property/property.usecase.interface';
import { PropertyResponseMapper } from '@application/mappers/property/property-response.mapper';
import { IPropertyRepository } from '@core/interfaces/repository/property-repository.interface';
import { UserRole } from '@shared/enums/user-role.enum';
import { logger } from '@shared/log/logger';
import { TokenTypes } from '@shared/types/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetMyPropertiesUseCase implements IGetMyPropertiesUseCase {
    constructor(
        @inject(TokenTypes.IPropertyRepository)
        private readonly _propertyRepo: IPropertyRepository,
    ) {}

    async execute(dto: GetMyPropertiesDTO): Promise<PaginatedPropertyResponse> {
        // main prt
        logger.info(`fetching properties for user: ${dto.ownerId}`);

        const skip = (dto.page - 1) * dto.limit;
        const take = dto.limit;

        if (dto.role === UserRole.TENANT) {
            const [properties, total] = await Promise.all([
                this._propertyRepo.findByTenantId(dto.ownerId, { status: dto.status, skip, take }),
                this._propertyRepo.countByTenantId(dto.ownerId, dto.status),
            ]);

            return {
                properties: properties.map(PropertyResponseMapper.toGeneralResponse),
                total,
                page: dto.page,
                limit: dto.limit,
            };
        }

        const [properties, total] = await Promise.all([
            this._propertyRepo.findByOwnerId(dto.ownerId, { status: dto.status, skip, take }),
            this._propertyRepo.countByOwnerId(dto.ownerId, dto.status),
        ]);

        return {
            properties: properties.map(PropertyResponseMapper.toGeneralResponse),
            total,
            page: dto.page,
            limit: dto.limit,
        };
    }
}
