import { Owner_Verification_Status } from 'shared/enums/owner-verification-status.enum';

export interface OwnerProfileTypeData {
    id: string;
    userId: string;
    bio?: string | null;
    occupation?: string | null;
    documentType?: string | null;
    documentUrl?: string | null;
    verificationStatus?: Owner_Verification_Status;
    rejectionReason?: string | null;
    verifiedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}
