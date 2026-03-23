import { SubmitVerificationDTO } from '@application/Data-Transfer-Object/Owner/OwnerVerificationDTO';
import { ISubmitVerificationUseCase } from '@application/Interfaces/Owner/ISubmitVerificationUseCase';
import { OwnerVerificationMapper } from '@application/Mappers/Profile/OwnerVerification.mapper';
import { IOwnerProfileRepository } from '@core/Interfaces/IOwnerRepository';
import { Owner_Verification_Status } from '@shared/Enums/owner.verification.status';
import {
    DocumentAlreadySubmittedError,
    OwnerProfileNotFoundError,
} from '@shared/Errors/Owner_Errors';
import { TokenTypes } from '@shared/Types/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SubmitVerificationUseCase implements ISubmitVerificationUseCase {
    constructor(
        @inject(TokenTypes.IOwnerProfileRepository)
        private readonly _ownerRepository: IOwnerProfileRepository,
    ) {}

    async execute(dto: SubmitVerificationDTO) {
        const ownerProfile = await this._ownerRepository.findByUserId(dto.ownerId);
        if (!ownerProfile) {
            throw new OwnerProfileNotFoundError();
        }
        if (ownerProfile.verificationStatus === Owner_Verification_Status.SUBMITTED) {
            throw new DocumentAlreadySubmittedError();
        }
        ownerProfile.documentSubmit(dto.documentType, dto.documentUrl);
        const updated = await this._ownerRepository.save(ownerProfile);
        // const updated = await this._ownerRepository.submitDocument(
        //     dto.ownerId,
        //     dto.documentType,
        //     dto.documentUrl
        // )
        return OwnerVerificationMapper.toResponse(updated);
    }
}
