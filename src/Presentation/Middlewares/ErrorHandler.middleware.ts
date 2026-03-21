// ErrorHandlerMiddleWare (handles all errors)

import { ApiResponse } from "@application/Data-Transfer-Object/ApiResponseDTO";
import { IErrorMiddleware } from "@presentation/Interfaces/Auth/IErrorMiddleware";
import { Http_StatusCodes } from "@shared/Enums/Http_StatusCodes";
import { ProjectErrors } from "@shared/Errors/Base/BaseError";
import { logger } from "@shared/Log/logger";
import { Request,Response,NextFunction } from "express";

export class ErrorHandlerMiddleWare implements IErrorMiddleware {
    public handleError(err: Error, req: Request, res: Response, next: NextFunction): Response {
        logger.error({err},'error to handle')

        if(err instanceof ProjectErrors){
        const errorResponse:ApiResponse<null>={
            success:false,
            message:err.message,
            code:err.code
        }
        return res.status(err.statusCode).json(errorResponse)
    }
    const errorResponse :ApiResponse<null>={
        success:false,
        message:'Something went wrong',
        code:'INTERNAL_SERVER_ERROR',
    }
    return res.status(Http_StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse)
    }
}