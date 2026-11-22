import { Http_StatusCodes } from '@shared/enums/http-status-codes.enum';
import { ProjectErrors } from './base/base.error';

export class AgreementNotFoundError extends ProjectErrors {
    constructor() {
        super(Http_StatusCodes.NOT_FOUND, 'AGREEMENT_NOT_FOUND', 'Agreement not found');
    }
}

export class InvalidAgreementStatusError extends ProjectErrors {
    constructor(status: string) {
        super(
            Http_StatusCodes.BAD_REQUEST,
            'INVALID_AGREEMENT_STATUS',
            `Cannot sign agreement in ${status} status`,
        );
    }
}

export class AgreementSignatureRequiredError extends ProjectErrors {
    constructor() {
        super(
            Http_StatusCodes.BAD_REQUEST,
            'AGREEMENT_SIGNATURE_REQUIRED',
            'Both parties must sign before PDF generation',
        );
    }
}

export class TenantEmailRequiredError extends ProjectErrors {
    constructor() {
        super(Http_StatusCodes.BAD_REQUEST, 'TENANT_EMAIL_REQUIRED', 'Tenant email is required');
    }
}

export class OwnerIdRequiredError extends ProjectErrors {
    constructor() {
        super(Http_StatusCodes.BAD_REQUEST, 'OWNER_ID_REQUIRED', 'Owner ID is required');
    }
}

export class TenantUserNotFoundError extends ProjectErrors {
    constructor() {
        super(
            Http_StatusCodes.NOT_FOUND,
            'TENANT_USER_NOT_FOUND',
            'No registered tenant found with the provided email address',
        );
    }
}

export class InvalidTenantRoleError extends ProjectErrors {
    constructor() {
        super(
            Http_StatusCodes.BAD_REQUEST,
            'INVALID_TENANT_ROLE',
            'The user with the provided email address is not registered as a tenant',
        );
    }
}

export class UnauthorizedRoleAccessError extends ProjectErrors {
    constructor() {
        super(
            Http_StatusCodes.FORBIDDEN,
            'UNAUTHORIZED_ROLE_ACCESS',
            'Unauthorized role to access agreements',
        );
    }
}

export class UnauthorizedAgreementAccessError extends ProjectErrors {
    constructor() {
        super(
            Http_StatusCodes.FORBIDDEN,
            'UNAUTHORIZED_AGREEMENT_ACCESS',
            'You are not allowed to perform this action on this agreement',
        );
    }
}
