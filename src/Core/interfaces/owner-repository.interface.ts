import { IBaseRepository } from './base/base-repository.interface';
import { OwnerProfileEntity } from 'core/entities/owner-profile.entity';
import { Owner_Verification_Status } from 'shared/enums/owner-verification-status.enum';

export interface IOwnerProfileRepository extends IBaseRepository<OwnerProfileEntity> {
    findByUserId(userId: string): Promise<OwnerProfileEntity | null>;
    submitDocument(userId: string, docType: string, docUrl: string): Promise<OwnerProfileEntity>;
    updateVerificationStatus(
        userId: string,
        status: Owner_Verification_Status.VERIFIED | Owner_Verification_Status.REJECTED,
        rejectionReason?: string,
    ): Promise<OwnerProfileEntity>;
    findAllPending(): Promise<OwnerProfileEntity[]>;
    save(entity: OwnerProfileEntity): Promise<OwnerProfileEntity>;
}
