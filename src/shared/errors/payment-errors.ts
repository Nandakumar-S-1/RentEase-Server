import { Http_StatusCodes } from '@shared/enums/http-status-codes.enum';
import { ProjectErrors } from './base/base.error';

export class PaymentNotFoundError extends ProjectErrors {
    constructor() {
        super(Http_StatusCodes.NOT_FOUND, 'PAYMENT_NOT_FOUND', 'Payment not found');
    }
}

export class InvalidPaymentStatusError extends ProjectErrors {
    constructor(status: string) {
        super(
            Http_StatusCodes.BAD_REQUEST,
            'INVALID_PAYMENT_STATUS',
            `Cannot process payment in ${status} status`,
        );
    }
}

export class PaymentAlreadyPaidError extends ProjectErrors {
    constructor() {
        super(Http_StatusCodes.BAD_REQUEST, 'PAYMENT_ALREADY_PAID', 'Payment is already completed');
    }
}

export class UnauthorizedPaymentAccessError extends ProjectErrors {
    constructor() {
        super(
            Http_StatusCodes.FORBIDDEN,
            'UNAUTHORIZED_PAYMENT_ACCESS',
            'You are not allowed to access this payment',
        );
    }
}
