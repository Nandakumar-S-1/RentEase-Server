import { PropertyEntity } from '@core/entities/property.entity';
import { IPropertyRepository } from '@core/interfaces/repository/property-repository.interface';
import { prisma } from '@infrastructure/database/prisma/prisma.client';
import { PropertyPersistenceMapper } from '@infrastructure/mappers/property-persistence.mapper';
import { PropertyVerificationStatus } from '@prisma/client';
import { PropertyNotFoundError } from '@shared/errors/property-errors';
import { injectable } from 'tsyringe';

@injectable()
export class PropertyRepository implements IPropertyRepository {
    async create(entity: PropertyEntity): Promise<PropertyEntity> {
        const data = PropertyPersistenceMapper.toCreatePersistence(entity);
        const result = await prisma.property.create({
            data,
            include: { details: true },
        });
        return PropertyPersistenceMapper.toEntity(result as any);
    }
    async findById(id: string): Promise<PropertyEntity | null> {
        const requiredProperty = await prisma.property.findUnique({
            where: { id },
            include: { details: true },
        });
        if (!requiredProperty) {
            return null;
        }
        return PropertyPersistenceMapper.toEntity(requiredProperty);
    }
    async findByOwnerId(
        ownerId: string,
        status?: string,
        skip?: number,
        take?: number,
    ): Promise<PropertyEntity[]> {
        const ownersProperty = await prisma.property.findMany({
            where: {
                ownerId,
                ...(status && { status: status as PropertyVerificationStatus }),
            },
            skip,
            take,
            orderBy: {
                createdAt: 'desc',
            },
            include: { details: true },
        });
        return ownersProperty.map((p) => PropertyPersistenceMapper.toEntity(p as any));
    }

    async countByOwnerId(ownerId: string, status?: string): Promise<number> {
        return await prisma.property.count({
            where: {
                ownerId,
                ...(status && { status: status as PropertyVerificationStatus }),
            },
        });
    }
    async findPending(): Promise<PropertyEntity[]> {
        const pendingProperties = await prisma.property.findMany({
            where: {
                status: PropertyVerificationStatus.PENDING_APPROVAL,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: { details: true },
        });
        return pendingProperties.map((p) => PropertyPersistenceMapper.toEntity(p as any));
    }
    async update(entity: PropertyEntity): Promise<PropertyEntity> {
        const data = PropertyPersistenceMapper.toUpdatePersistence(entity);

        const updatedResult = await prisma.property.update({
            where: {
                id: entity.id,
            },
            data,
            include: { details: true },
        });
        return PropertyPersistenceMapper.toEntity(updatedResult as any);
    }
    async unlist(id: string): Promise<void> {
        const property = await this.findById(id);
        if (!property) throw new PropertyNotFoundError();
        property.unlist(); //entity method
        await this.update(property);
    }
    async delete(id: string): Promise<void> {
        await prisma.property.delete({
            where: { id },
        });
    }

    async incrementViews(id: string): Promise<void> {
        await prisma.property.update({
            where: { id },
            data: { viewsCount: { increment: 1 } },
        });
    }

    async findAll(status?: string, skip?: number, take?: number): Promise<PropertyEntity[]> {
        const properties = await prisma.property.findMany({
            where: {
                ...(status && { status: status as PropertyVerificationStatus }),
            },
            skip,
            take,
            orderBy: {
                createdAt: 'desc',
            },
            include: { details: true },
        });
        return properties.map((p) => PropertyPersistenceMapper.toEntity(p as any));
    }

    async countAll(status?: string): Promise<number> {
        return await prisma.property.count({
            where: {
                ...(status && { status: status as PropertyVerificationStatus }),
            },
        });
    }
}
