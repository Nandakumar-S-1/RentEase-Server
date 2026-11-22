import { OwnerVerificationResponseDTO } from 'application/dtos/owner/response/owner-verification-response.dto';
import { PendingOwnerDTO } from 'application/dtos/owner/response/pending-owner-response.dto';

export interface IVerifyOwnerUseCase {
    verifyOwner(ownerId: string): Promise<OwnerVerificationResponseDTO>;
    rejectOwner(ownerId: string, reason: string): Promise<OwnerVerificationResponseDTO>;
    getPendingOwners(): Promise<PendingOwnerDTO[]>;
    getOwnerVerificationDetails(ownerId: string): Promise<OwnerVerificationResponseDTO>;
}
