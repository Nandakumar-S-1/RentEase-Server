import { PendingOwnerDTO } from 'application/dtos/owner/response/pending-owner-response.dto';
import { OwnerProfileEntity } from 'core/entities/owner-profile.entity';

export class OwnerVerificationMapper {
    static toResponse(entity: OwnerProfileEntity) {
        return {
            id: entity.id,
            ownerId: entity.userId,
            documentType: entity.documentType ? entity.documentType : null,
            documentUrl: entity.documentUrl ? entity.documentUrl : null,
            status: entity.verificationStatus,
            rejectionReason: entity.rejectionReason ?? null,
            submittedAt: entity.createdAt,
        };
    }
    static toPendingListResponse(entity: OwnerProfileEntity[]): PendingOwnerDTO[] {
        return entity.map((e) => ({
            id: e.id,
            ownerId: e.userId,
            documentType: e.documentType ? e.documentType : null,
            documentUrl: e.documentUrl ? e.documentUrl : null,
            status: e.verificationStatus,
        }));
    }
}
