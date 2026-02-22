import { Http_StatusCodes } from "@shared/Enums/Http_StatusCodes";
import { ProjectErrors } from "./Base/BaseError";

export class InvalidCredentialsError extends ProjectErrors{
    constructor(){
        super(Http_StatusCodes.UN_AUTHORIZED,'INVALID_CREDENTIALS','Given Invalid email or password')
    }
}

export class EmailNotVerifiedError extends ProjectErrors{
    constructor(){
        super(Http_StatusCodes.UN_AUTHORIZED,'EMAIL_NOT_VERIFIED','Email is not verified, verify it before logging in')
    }
}

export class AccountSuspendedError extends ProjectErrors{
    constructor(){
        super(Http_StatusCodes.UN_AUTHORIZED,'ACCOUNT_SUSPENDED','Your account has been suspended')
    }
}

export class AccountNotActiveError extends ProjectErrors{
    constructor(){
        super(Http_StatusCodes.UN_AUTHORIZED,'ACCOUNT_DEACTIVATED','Account is deactivated')
    }
}
