import { TenantProfileEntity } from 'core/entities/tenant-profile.entity';
import { TenantProfile } from '@prisma/client';

//db to entity
export class TenantProfilePersistenceMapper {
    static toEntity(raw: TenantProfile): TenantProfileEntity {
        return TenantProfileEntity.create({
            id: raw.id,
            userId: raw.userId,
            bio: raw.bio,
            occupation: raw.occupation,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
}
