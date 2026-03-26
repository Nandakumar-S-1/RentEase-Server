import { PendingOwnerDTO } from '@application/Data-Transfer-Object/Owner/PendingOwnerDTO';
import { OwnerProfileEntity } from '@core/Entities/OwnerProfileEntity.entity';

export class OwnerVerificationMapper {
    static toResponse(entity: OwnerProfileEntity) {
        return {
            id: entity.id,
            ownerId: entity.userId,
            documentType: entity.documentType,
            status: entity.verificationStatus,
            rejectionReason: entity.rejectionReason,
            submittedAt: entity.createdAt,
        };
    }
    static toPendingListResponse(entity: OwnerProfileEntity[]): PendingOwnerDTO[] {
        return entity.map((e) => ({
            id: e.id,
            ownerId: e.userId,
            documentType: e.documentType,
            documentUrl: e.documentUrl,
            status: e.verificationStatus,
        }));
    }
}
