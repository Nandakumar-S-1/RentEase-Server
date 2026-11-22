import { Http_StatusCodes } from 'shared/enums/http-status-codes.enum';
import { ProjectErrors } from './base/base.error';
import { Common_Response_Messages } from '../types/messages/Response.messages';

export class NotFoundError extends ProjectErrors {
    constructor(message: string = Common_Response_Messages.NOT_FOUND) {
        super(Http_StatusCodes.NOT_FOUND, 'NOT_FOUND', message);
    }
}

export class UnauthorizedError extends ProjectErrors {
    constructor(message: string = Common_Response_Messages.UNAUTHORIZED) {
        super(Http_StatusCodes.UN_AUTHORIZED, 'UNAUTHORIZED', message);
    }
}

export class ForbiddenError extends ProjectErrors {
    constructor(message: string = Common_Response_Messages.FORBIDDEN) {
        super(Http_StatusCodes.FORBIDDEN, 'FORBIDDEN', message);
    }
}

export class BadRequestError extends ProjectErrors {
    constructor(message: string = Common_Response_Messages.BAD_REQUEST) {
        super(Http_StatusCodes.BAD_REQUEST, 'BAD_REQUEST', message);
    }
}
