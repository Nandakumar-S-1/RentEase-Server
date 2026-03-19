import { Http_StatusCodes } from '@shared/Enums/Http_StatusCodes';
import { ProjectErrors } from './Base/BaseError';
import { Owner_Verification_Staus } from '@shared/Enums/owner.verification.status';

export class OwnerVerifiedError extends ProjectErrors {
  constructor() {
    super(Http_StatusCodes.CONFLICT, 'OWNER_ALREADY_VERIFIED', 'Owner is already verified');
  }
}

export class InvalidVerificationError extends ProjectErrors {
  constructor(currentState: Owner_Verification_Staus, action: string) {
    super(
      Http_StatusCodes.BAD_REQUEST,
      'INVALID_VERIFICATION_STATE',
      `Cannot ${action} when status is ${currentState}`,
    );
  }
}

export class RejectionReasonError extends ProjectErrors {
  constructor() {
    super(
      Http_StatusCodes.BAD_REQUEST,
      'REJECTION_REASON_REQUIRED',
      'Rejection reason is required',
    );
  }
}

export class OwnerProfileNotFoundError extends ProjectErrors {
  constructor() {
    super(Http_StatusCodes.NOT_FOUND, 'OWNER_PROFILE_NOTFOUND', 'Owner profile not found');
  }
}

export class DocumentAlreadySubmittedError extends ProjectErrors{
    constructor(){
        super(
            Http_StatusCodes.BAD_REQUEST,'DOCUMENT_HAS_ALREADY_SUBMITTED','Document already submitted and is pending review'
        )
    }
}