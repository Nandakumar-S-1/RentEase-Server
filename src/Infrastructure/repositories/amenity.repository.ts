import { IAmenityRepository } from '@core/interfaces/repository/amenity-repository.interface';
import { AmenityEntity } from '@core/entities/amenity.entity';
import { prisma } from '@infrastructure/database/prisma/prisma.client';
import { injectable } from 'tsyringe';
import { AmenityPersistenceMapper } from '@infrastructure/mappers/amenity-persistence.mapper';

@injectable()
export class AmenityRepository implements IAmenityRepository {


    async create(entity: AmenityEntity): Promise<AmenityEntity> {
        const created = await prisma.amenity.create({
            data: AmenityPersistenceMapper.toPrismaCreate(entity)
        });
        return AmenityPersistenceMapper.toDomainEntity(created);
    }

    async update(entity: AmenityEntity): Promise<AmenityEntity> {
        const updated = await prisma.amenity.update({
            where: { id: entity.id },
            data: AmenityPersistenceMapper.toPrismaUpdate(entity)
        });
        return AmenityPersistenceMapper.toDomainEntity(updated);
    }

    async delete(id: string): Promise<void> {
        await prisma.amenity.delete({ where: { id } });
    }

    async findById(id: string): Promise<AmenityEntity | null> {
        const found = await prisma.amenity.findUnique({ where: { id } });
        return found ? AmenityPersistenceMapper.toDomainEntity(found) : null;
    }

    async findAll(): Promise<AmenityEntity[]> {
        const all = await prisma.amenity.findMany();
        return all.map(AmenityPersistenceMapper.toDomainEntity);
    }
}
