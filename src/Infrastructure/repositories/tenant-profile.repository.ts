import { TenantProfileEntity } from 'core/entities/tenant-profile.entity';
import { ITenantProfileRepository } from 'core/interfaces/tenant-repository.interface';
import { prisma } from 'infrastructure/database/prisma/prisma.client';
import { TenantProfilePersistenceMapper } from 'infrastructure/mappers/tenant-profile-persistence.mapper';
import { injectable } from 'tsyringe';

@injectable()
export class TenantProfileRepository implements ITenantProfileRepository {
    async findByUserId(userId: string): Promise<TenantProfileEntity | null> {
        const result = await prisma.tenantProfile.findUnique({
            where: { userId },
        });
        return result ? TenantProfilePersistenceMapper.toEntity(result) : null;
    }

    async create(entity: TenantProfileEntity): Promise<TenantProfileEntity> {
        const result = await prisma.tenantProfile.create({
            data: {
                user: { connect: { id: entity.userId } },
                bio: entity.bio,
                occupation: entity.occupation,
            },
        });
        return TenantProfilePersistenceMapper.toEntity(result);
    }

    async save(entity: TenantProfileEntity): Promise<TenantProfileEntity> {
        const result = await prisma.tenantProfile.update({
            where: { userId: entity.userId },
            data: {
                bio: entity.bio,
                occupation: entity.occupation,
            },
        });
        return TenantProfilePersistenceMapper.toEntity(result);
    }
}
