import { Http_StatusCodes } from "@shared/Enums/Http_StatusCodes";
import { ProjectErrors } from "./Base/BaseError";


export class accessTokenCreationError extends ProjectErrors{
    constructor(message='Failed to create an Access token'){
        super(Http_StatusCodes.INTERNAL_SERVER_ERROR,'ACCESS_TOKEN_CREATION_FAILED',message)
    }
}

export class refreshTOkenCreationError extends ProjectErrors{
    constructor(message='Failed to create a refresh token'){
        super(Http_StatusCodes.INTERNAL_SERVER_ERROR,'REFRESH_TOKEN_CREATION_FAILED',message)
    }
}

export class InvalidAccessToken extends ProjectErrors{
    constructor(message='Access token is Invalid'){
        super(Http_StatusCodes.UN_AUTHORIZED,'INVALID_ACCESS_TOKEN',message)
    }
}

export class InvalidRefreshToken extends ProjectErrors{
    constructor(message='Refresh token is Invalid'){
        super(Http_StatusCodes.UN_AUTHORIZED,'INVALID_REFRESH_TOKEN',message)
    }
}