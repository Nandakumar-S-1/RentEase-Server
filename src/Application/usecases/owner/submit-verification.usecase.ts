import { SubmitVerificationDTO } from 'application/dtos/owner/request/owner-verification-request.dto';
import { ISubmitVerificationUseCase } from 'application/interfaces/owner/submit-verification.usecase.interface';
import { OwnerVerificationMapper } from 'application/mappers/profile/owner-verification.mapper';
import { IOwnerProfileRepository } from 'core/interfaces/owner-repository.interface';
import { Owner_Verification_Status } from 'shared/enums/owner-verification-status.enum';
import {
    DocumentAlreadySubmittedError,
    OwnerProfileNotFoundError,
} from 'shared/errors/owner-errors';
import { TokenTypes } from 'shared/types/tokens';
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
