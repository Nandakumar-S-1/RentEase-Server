import { Owner_Verification_Staus } from "@shared/Enums/owner.verification.status"

export interface OwnerProfileTypeData{
        id:string
        userId:string,
        bio?:string|null,
        occupation?:string|null,
        documentType ?:string|null,
        documentUrl ?:string|null,
        verificationStatus?:Owner_Verification_Staus,
        rejectionReason?:string|null,
        verifiedAt?:Date|null,
        createdAt?:Date,
        updatedAt?:Date
}