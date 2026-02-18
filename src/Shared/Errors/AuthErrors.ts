import { Http_StatusCodes } from "@shared/Enums/Http_StatusCodes"

export class ProjectErrors extends Error{
    constructor(
        public statusCode:number,
        public message:string,
        public code:string
    ) {
        super(message)
        this.name=this.constructor.name
    }
}

export class InvalidOtpError extends ProjectErrors{
    constructor(message = 'Invalid OTP'){
        super(Http_StatusCodes.BAD_REQUEST,'INVALID_OTP',message)
    }
}

export class OtpExpiredError extends ProjectErrors{
    constructor(message='OTP has expired'){
        super(Http_StatusCodes.BAD_REQUEST,'OTP_EXPIRED',message)
    }
}

export class MaxOtpAttemptError extends ProjectErrors{
    constructor(message:'Maximum OTP verification Attempts reached'){
        super(Http_StatusCodes.NOT_FOUND,'NOT_FOUND',message)
    }
}