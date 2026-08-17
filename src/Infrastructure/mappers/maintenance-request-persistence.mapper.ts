import { MaintenanceRequestEntity } from '@core/entities/maintenance-request.entity';

export class MaintenanceRequestPersistenceMapper {
    static toPrismaCreate(data: Partial<MaintenanceRequestEntity>) {
        return {
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
        };
    }

    static toPrismaUpdate(data: Partial<MaintenanceRequestEntity>) {
        return {
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
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static toDomainEntity(data: any): MaintenanceRequestEntity {
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
