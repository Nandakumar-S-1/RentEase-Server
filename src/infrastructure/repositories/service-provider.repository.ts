import {
    IServiceProviderRepository,
    ServiceProviderData,
} from '@core/interfaces/repository/service-provider.repository.interface';
import { prisma } from '@infrastructure/database/prisma/prisma.client';
import { ServiceProviderPersistenceMapper } from 'infrastructure/mappers/service-provider-persistence.mapper';
import { injectable } from 'tsyringe';

@injectable()
export class ServiceProviderRepository implements IServiceProviderRepository {
    async create(data: Omit<ServiceProviderData, 'id'>): Promise<ServiceProviderData> {
        const prismaData = ServiceProviderPersistenceMapper.toPrismaCreate(data);
        const result = await prisma.serviceProvider.create({
            data: prismaData,
        });
        return ServiceProviderPersistenceMapper.toData(result);
    }

    async findByPropertyId(
        propertyId: string,
        skip?: number,
        limit?: number,
    ): Promise<ServiceProviderData[]> {
        const results = await prisma.serviceProvider.findMany({
            where: { property_id: propertyId },
            orderBy: { created_at: 'desc' },
            skip,
            take: limit,
        });
        return results.map(ServiceProviderPersistenceMapper.toData);
    }

    async countByPropertyId(propertyId: string): Promise<number> {
        return await prisma.serviceProvider.count({
            where: { property_id: propertyId },
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.serviceProvider.delete({
            where: { id },
        });
    }

    async updateStatus(id: string, isActive: boolean): Promise<void> {
        await prisma.serviceProvider.update({
            where: { id },
            data: { is_active: isActive },
        });
    }
}
