import { OwnerVerificationResponseDTO } from "@application/Data-Transfer-Object/Owner/OwnerVerificationResponseDTO"
import { PendingOwnerDTO } from "@application/Data-Transfer-Object/Owner/PendingOwnerDTO"

export interface IVerifyOwnerUseCase {
    verifyOwner(ownerId: string): Promise<OwnerVerificationResponseDTO>
    rejectOwner(ownerId: string, reason: string): Promise<OwnerVerificationResponseDTO>
    getPendingOwners(): Promise<PendingOwnerDTO[]>
}