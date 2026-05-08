import { Response } from 'express';
import { ApiResponse } from '../../application/dtos/api-response.dto';
import { Http_StatusCodes } from '../../shared/enums/http-status-codes.enum';

export class ResponseHandler {
    static success<T>(
        res: Response,
        data: T,
        message: string = 'Success',
        statusCode: Http_StatusCodes = Http_StatusCodes.OK,
    ): Response {
        const response: ApiResponse<T> = {
            success: true,
            message,
            data,
        };
        return res.status(statusCode).json(response);
    }
    static error(
        res: Response,
        message: string = 'Internal Server Error',
        statusCode: Http_StatusCodes = Http_StatusCodes.INTERNAL_SERVER_ERROR,
        code?: string,
    ): Response {
        const response: ApiResponse<null> = {
            success: false,
            message,
            code,
        };
        return res.status(statusCode).json(response);
    }
}
