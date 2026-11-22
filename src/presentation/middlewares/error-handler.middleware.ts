import { ApiResponse } from 'application/dtos/api-response.dto';
import { IErrorMiddleware } from 'presentation/interfaces/auth/error.middleware.interface';
import { Http_StatusCodes } from 'shared/enums/http-status-codes.enum';
import { ProjectErrors } from 'shared/errors/base/base.error';
import { logger } from 'shared/log/logger';
import { Request, Response, NextFunction } from 'express';

export class ErrorHandlerMiddleWare implements IErrorMiddleware {
    public handleError(err: Error, req: Request, res: Response, _next: NextFunction): Response {
        logger.error({ err }, 'error to handle');

        if (err instanceof ProjectErrors) {
            const errorResponse: ApiResponse<null> = {
                success: false,
                message: err.message,
                code: err.code,
            };
            return res.status(err.statusCode).json(errorResponse);
        }
        const errorResponse: ApiResponse<null> = {
            success: false,
            message: 'Something went wrong',
            code: 'INTERNAL_SERVER_ERROR',
        };
        return res.status(Http_StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
}
