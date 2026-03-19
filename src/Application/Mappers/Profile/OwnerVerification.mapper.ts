import { OwnerProfileEntity } from "@core/Entities/OwnerProfileEntity.entity";

export class OwnerVerificationMapper{
    static toResponse(entity:OwnerProfileEntity){
        return{
            id:entity.id,
            ownerId:entity.userId,
            documetType:entity.documentType,
            status:entity.verificationStatus,
            rejectionReason:entity.rejectionReason,
            submittedAt:entity.createdAt
        }
    }
    static toPendingListResponse(entity:OwnerProfileEntity[]){
        return entity.map((e)=>({
            ownerId:e.userId,
            documentType:e.documentType,
            documentUrl:e.documentUrl,
            submittedAt:e.updatedAt
        }))
    }
}