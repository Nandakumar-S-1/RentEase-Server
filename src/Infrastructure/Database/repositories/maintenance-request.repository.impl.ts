import { IMaintenanceRequestRepository } from '@core/interfaces/repository/maintenance-request.repository.interface';
import { MaintenanceRequestEntity } from '@core/entities/maintenance-request.entity';
import { prisma } from '@infrastructure/database/prisma/prisma.client';
import { injectable } from 'tsyringe';

@injectable()
export class MaintenanceRequestRepositoryImpl implements IMaintenanceRequestRepository {
    async create(data: Partial<MaintenanceRequestEntity>): Promise<MaintenanceRequestEntity> {
        const created = await prisma.maintenanceRequest.create({
            data: {
                requestNumber: data.requestNumber!,
                propertyId: data.propertyId!,
                tenantId: data.tenantId!,
                ownerId: data.ownerId!,
                issueType: data.issueType!,
                issueTitle: data.issueTitle!,
                issueDescription: data.issueDescription!,
                urgencyLevel: data.urgencyLevel as string,
                photos: data.photos || [],
                preferredVisitDate: data.preferredVisitDate || null,
                preferredVisitTimeStart: data.preferredVisitTimeStart || null,
                preferredVisitTimeEnd: data.preferredVisitTimeEnd || null,
                availableAnytime: data.availableAnytime || false,
                status: data.status as string,
            },
            include: {
                property: { select: { title: true } },
                tenant: { select: { fullName: true } },
                serviceProvider: { select: { provider_name: true } },
            },
        });
        return this._mapToEntity(created);
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
        return this._mapToEntity(request);
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
        return requests.map(this._mapToEntity.bind(this));
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
        return requests.map(this._mapToEntity.bind(this));
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
        return requests.map(this._mapToEntity.bind(this));
    }

    async update(
        id: string,
        data: Partial<MaintenanceRequestEntity>,
    ): Promise<MaintenanceRequestEntity> {
        const updated = await prisma.maintenanceRequest.update({
            where: { id },
            data: {
                assignedProviderId: data.assignedProviderId,
                status: data.status as string,
                providerAcceptedAt: data.providerAcceptedAt,
                providerEtaMinutes: data.providerEtaMinutes,
                providerArrivalTime: data.providerArrivalTime,
                workStartedAt: data.workStartedAt,
                workCompletedAt: data.workCompletedAt,
                completionPhotos: data.completionPhotos,
                workDescription: data.workDescription,
                actualCost: data.actualCost ? Number(data.actualCost) : undefined,
                costPaidBy: data.costPaidBy,
                isVerifiedByTenant: data.isVerifiedByTenant,
                tenantVerificationStatus: data.tenantVerificationStatus,
                tenantRating: data.tenantRating,
                tenantFeedback: data.tenantFeedback,
                verifiedAt: data.verifiedAt,
                isDisputed: data.isDisputed,
                disputeReason: data.disputeReason,
                closedAt: data.closedAt,
            },
            include: {
                property: { select: { title: true } },
                tenant: { select: { fullName: true } },
                serviceProvider: { select: { provider_name: true } },
            },
        });
        return this._mapToEntity(updated);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _mapToEntity(data: any): MaintenanceRequestEntity {
        return new MaintenanceRequestEntity(
            data.id,
            data.requestNumber,
            data.propertyId,
            data.tenantId,
            data.ownerId,
            data.issueType,
            data.issueTitle,
            data.issueDescription,
            data.urgencyLevel,
            data.photos,
            data.preferredVisitDate,
            data.preferredVisitTimeStart,
            data.preferredVisitTimeEnd,
            data.availableAnytime,
            data.assignedProviderId,
            data.providerAcceptedAt,
            data.providerEtaMinutes,
            data.providerArrivalTime,
            data.status,
            data.workStartedAt,
            data.workCompletedAt,
            data.completionPhotos,
            data.workDescription,
            data.actualCost ? Number(data.actualCost) : null,
            data.costPaidBy,
            data.isVerifiedByTenant,
            data.tenantVerificationStatus,
            data.tenantRating,
            data.tenantFeedback,
            data.verifiedAt,
            data.isDisputed,
            data.disputeReason,
            data.submittedAt,
            data.updatedAt,
            data.closedAt,
            data.property?.title,
            data.tenant?.fullName,
            data.serviceProvider?.provider_name,
        );
    }
}
