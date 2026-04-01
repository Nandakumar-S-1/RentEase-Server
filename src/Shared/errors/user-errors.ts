import { Http_StatusCodes } from 'shared/enums/http-status-codes.enum';
import { ProjectErrors } from './base/base.error';

export class UserAlreadyExistError extends ProjectErrors {
    constructor() {
        super(
            Http_StatusCodes.CONFLICT,
            'USER_ALREADY_EXISTS',
            'User alredy exists with this email',
        );
    }
}

export class PhoneAlreadyExistError extends ProjectErrors {
    constructor() {
        super(
            Http_StatusCodes.CONFLICT,
            'PHONE_ALREADY_EXIST',
            'User with this phone number already exist',
        );
    }
}
