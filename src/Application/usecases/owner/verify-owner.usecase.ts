import { IVerifyOwnerUseCase } from 'application/interfaces/admin/verify-owner.usecase.interface';
import { OwnerVerificationMapper } from 'application/mappers/profile/owner-verification.mapper';
import { IOwnerProfileRepository } from 'core/interfaces/owner-repository.interface';
import { Owner_Verification_Status } from 'shared/enums/owner-verification-status.enum';
import { OwnerProfileNotFoundError } from 'shared/errors/owner-errors';
import { TokenTypes } from 'shared/types/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class VerifyOwnerUseCase implements IVerifyOwnerUseCase {
    constructor(
        @inject(TokenTypes.IOwnerProfileRepository)
        private readonly _ownerRepository: IOwnerProfileRepository,
    ) {}
    async verifyOwner(ownerId: string) {
        const ownerProfile = await this._ownerRepository.findByUserId(ownerId);
        if (!ownerProfile) {
            throw new OwnerProfileNotFoundError();
        }
        ownerProfile.approve(); //entity method to handle validation
        const updated = await this._ownerRepository.updateVerificationStatus(
            ownerId,
            Owner_Verification_Status.VERIFIED,
        );
        return OwnerVerificationMapper.toResponse(updated);
    }
    async rejectOwner(ownerId: string, reason: string) {
        const ownerProfile = await this._ownerRepository.findByUserId(ownerId);
        if (!ownerProfile) {
            throw new OwnerProfileNotFoundError();
        }
        ownerProfile.reject(reason); //also domaain method
        const updated = await this._ownerRepository.updateVerificationStatus(
            ownerId,
            Owner_Verification_Status.REJECTED,
            reason,
        );
        return OwnerVerificationMapper.toResponse(updated);
    }
    async getPendingOwners() {
        const pending = await this._ownerRepository.findAllPending();
        return OwnerVerificationMapper.toPendingListResponse(pending);
    }

    async getOwnerVerificationDetails(ownerId: string) {
        const ownerProfile = await this._ownerRepository.findByUserId(ownerId);
        if (!ownerProfile) {
            throw new OwnerProfileNotFoundError();
        }
        return OwnerVerificationMapper.toResponse(ownerProfile);
    }
}
