import { OwnerProfileEntity } from "@core/Entities/OwnerProfileEntity.entity";
import { OwnerProfileTypeData } from "@core/Types/ownerProfile.types";
import { OwnerProfile } from "@prisma/client";
import { Owner_Verification_Status  } from "@shared/Enums/owner.verification.status";

export class OwnerProfilePersistenceMapper{
    static toEntity(prisma:OwnerProfile):OwnerProfileEntity{
        const data : OwnerProfileTypeData ={
            id:prisma.id,
            userId:prisma.user_id,
            bio:prisma.bio,
            occupation:prisma.occupation,
            documentType:prisma.documentType,
            documentUrl:prisma.documentUrl,
            verificationStatus:prisma.verificationStatus as Owner_Verification_Status ,
            verifiedAt:prisma.verifiedAt,
            rejectionReason:prisma.rejectionReason,
            createdAt:prisma.createdAt,
            updatedAt:prisma.updatedAt
        }
        return OwnerProfileEntity.create(data)
    }
}