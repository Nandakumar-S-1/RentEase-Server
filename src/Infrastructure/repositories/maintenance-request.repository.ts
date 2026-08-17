import { IMaintenanceRequestRepository } from '@core/interfaces/repository/maintenance-request.repository.interface';
import { MaintenanceRequestEntity } from '@core/entities/maintenance-request.entity';
import { prisma } from '@infrastructure/database/prisma/prisma.client';
import { injectable } from 'tsyringe';
import { MaintenanceRequestPersistenceMapper } from '@infrastructure/mappers/maintenance-request-persistence.mapper';

@injectable()
export class MaintenanceRequestRepositoryImpl implements IMaintenanceRequestRepository {
    async create(data: Partial<MaintenanceRequestEntity>): Promise<MaintenanceRequestEntity> {
        const created = await prisma.maintenanceRequest.create({
            data: MaintenanceRequestPersistenceMapper.toPrismaCreate(data),
            include: {
                property: { select: { title: true } },
                tenant: { select: { fullName: true } },
                serviceProvider: { select: { provider_name: true } },
            },
        });
        return MaintenanceRequestPersistenceMapper.toDomainEntity(created);
    }

    async findById(id: string): Promise<MaintenanceRequestEntity | null> {
        const request = await prisma.maintenanceRequest.findUnique({
            where: { id },
            include: {
                property: { select: { title: true } },
                tenant: { select: { fullName: true } },
                serviceProvider: { select: { provider_name: true } },
            },
        });
        if (!request) return null;
        return MaintenanceRequestPersistenceMapper.toDomainEntity(request);
    }

    async findByPropertyId(propertyId: string): Promise<MaintenanceRequestEntity[]> {
        const requests = await prisma.maintenanceRequest.findMany({
            where: { propertyId },
            include: {
                property: { select: { title: true } },
                tenant: { select: { fullName: true } },
                serviceProvider: { select: { provider_name: true } },
            },
            orderBy: { submittedAt: 'desc' },
        });
        return requests.map(MaintenanceRequestPersistenceMapper.toDomainEntity);
    }

    async findByTenantId(tenantId: string): Promise<MaintenanceRequestEntity[]> {
        const requests = await prisma.maintenanceRequest.findMany({
            where: { tenantId },
            include: {
                property: { select: { title: true } },
                tenant: { select: { fullName: true } },
                serviceProvider: { select: { provider_name: true } },
            },
            orderBy: { submittedAt: 'desc' },
        });
        return requests.map(MaintenanceRequestPersistenceMapper.toDomainEntity);
    }

    async findByOwnerId(ownerId: string): Promise<MaintenanceRequestEntity[]> {
        const requests = await prisma.maintenanceRequest.findMany({
            where: { ownerId },
            include: {
                property: { select: { title: true } },
                tenant: { select: { fullName: true } },
                serviceProvider: { select: { provider_name: true } },
            },
            orderBy: { submittedAt: 'desc' },
        });
        return requests.map(MaintenanceRequestPersistenceMapper.toDomainEntity);
    }

    async update(
        id: string,
        data: Partial<MaintenanceRequestEntity>,
    ): Promise<MaintenanceRequestEntity> {
        const updated = await prisma.maintenanceRequest.update({
            where: { id },
            data: MaintenanceRequestPersistenceMapper.toPrismaUpdate(data),
            include: {
                property: { select: { title: true } },
                tenant: { select: { fullName: true } },
                serviceProvider: { select: { provider_name: true } },
            },
        });
        return MaintenanceRequestPersistenceMapper.toDomainEntity(updated);
    }
}
