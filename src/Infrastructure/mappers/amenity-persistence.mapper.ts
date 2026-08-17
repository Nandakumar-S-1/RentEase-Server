import { AmenityEntity } from '@core/entities/amenity.entity';

export class AmenityPersistenceMapper {
    static toPrismaCreate(entity: AmenityEntity) {
        return {
            id: entity.id,
            name: entity.name,
            iconUrl: entity.iconUrl,
            isApproved: entity.isApproved,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    static toPrismaUpdate(entity: AmenityEntity) {
        return {
            name: entity.name,
            iconUrl: entity.iconUrl,
            isApproved: entity.isApproved,
            updatedAt: entity.updatedAt,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static toDomainEntity(model: any): AmenityEntity {
        return AmenityEntity.create(model);
    }
}
