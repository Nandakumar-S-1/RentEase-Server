import { Http_StatusCodes } from '@shared/Enums/Http_StatusCodes';
import { ProjectErrors } from './Base/BaseError';

export class InvalidOtpError extends ProjectErrors {
  constructor(message = 'Invalid OTP') {
    super(Http_StatusCodes.BAD_REQUEST, 'INVALID_OTP', message);
  }
}

export class OtpExpiredError extends ProjectErrors {
  constructor(message = 'OTP has expired') {
    super(Http_StatusCodes.BAD_REQUEST, 'OTP_EXPIRED', message);
  }
}

export class MaxOtpAttemptError extends ProjectErrors {
  constructor(message: 'Maximum OTP verification Attempts reached') {
    super(Http_StatusCodes.BAD_REQUEST, 'MAX_OTP_ATTEMPTS', message);
  }
}
