import { PropertyEntity } from '@core/entities/property.entity';
import { GetAllPropertiesDTO } from '@application/interfaces/property/property.usecase.interface';
import { IPropertyRepository } from '@core/interfaces/repository/property-repository.interface';
import { prisma } from '@infrastructure/database/prisma/prisma.client';
import { PropertyPersistenceMapper } from '@infrastructure/mappers/property-persistence.mapper';
import { Prisma, Property, PropertyDetails, PropertyVerificationStatus } from '@prisma/client';
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

        return PropertyPersistenceMapper.toEntity(result as Property & { details: PropertyDetails | null });
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
        return ownersProperty.map((p) => PropertyPersistenceMapper.toEntity(p as Property & { details: PropertyDetails | null }));
    }

    async countByOwnerId(ownerId: string, status?: string): Promise<number> {
        return await prisma.property.count({
            where: {
                ownerId,
                ...(status && { status: status as PropertyVerificationStatus }),
            },
        });
    }
    async findPending(skip?: number, take?: number): Promise<PropertyEntity[]> {
        const pendingProperties = await prisma.property.findMany({
            where: {
                status: PropertyVerificationStatus.PENDING_APPROVAL,
            },
            skip,
            take,
            orderBy: {
                createdAt: 'desc',
            },
            include: { details: true },
        });
        return pendingProperties.map((p) => PropertyPersistenceMapper.toEntity(p as Property & { details: PropertyDetails | null }));
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
        return PropertyPersistenceMapper.toEntity(updatedResult as Property & { details: PropertyDetails | null });
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

    async relist(id: string): Promise<void> {
        const property = await this.findById(id);
        if (!property) throw new PropertyNotFoundError();
        property.relist();
        await this.update(property);
    }
    
    async incrementViews(id: string): Promise<void> {
        await prisma.property.update({
            where: { id },
            data: { viewsCount: { increment: 1 } },
        });
    }

    async findAll(status?: string, skip?: number, take?: number, filters?: Partial<GetAllPropertiesDTO>): Promise<PropertyEntity[]> {
        const where = this._buildWhereClause(status, filters);
        const properties = await prisma.property.findMany({
            where,
            skip,
            take,
            orderBy: {
                createdAt: 'desc',
            },
            include: { details: true },
        });
        return properties.map((p) => PropertyPersistenceMapper.toEntity(p as Property & { details: PropertyDetails | null }));
    }

    async countAll(status?: string, filters?: Partial<GetAllPropertiesDTO>): Promise<number> {
        const where = this._buildWhereClause(status, filters);
        return await prisma.property.count({
            where,
        });
    }

    private _buildWhereClause(status?: string, filters?: Partial<GetAllPropertiesDTO>) {
        const where: Prisma.PropertyWhereInput = {
            ...(status && { status: status as PropertyVerificationStatus }),
        };

        if (filters) {
            const { query, city, propertyType, minRent, maxRent, minArea, maxArea, bhk } = filters;

            if (query) {
                where.OR = [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { fullAddress: { contains: query, mode: 'insensitive' } },
                ];
            }

            if (city) {
                where.locationCity = { contains: city, mode: 'insensitive' };
            }

            if (propertyType) {
                where.propertyType = propertyType;
            }

            if (minRent !== undefined || maxRent !== undefined) {
                where.monthlyRent = {
                    ...(minRent !== undefined && { gte: Number(minRent) }),
                    ...(maxRent !== undefined && { lte: Number(maxRent) }),
                };
            }

            if (minArea !== undefined || maxArea !== undefined) {
                where.areaSqrt = {
                    ...(minArea !== undefined && { gte: Number(minArea) }),
                    ...(maxArea !== undefined && { lte: Number(maxArea) }),
                };
            }

            if (bhk !== undefined) {
                where.details = {
                    bhk: Number(bhk),
                };
            }
        }

        return where;
    }
}
