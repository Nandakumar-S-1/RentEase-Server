import { ApiResponse } from '@application/Data-Transfer-Object/ApiResponseDTO';
import { ResendOtpResponseDTO } from '@application/Data-Transfer-Object/Authentication/Response/ResendOtpResponseDTO';
import { IResendOtpUseCase } from '@application/Interfaces/Auth/IResendOtpUseCase';
import { Http_StatusCodes } from '@shared/Enums/Http_StatusCodes';
import { logger } from '@shared/Log/logger';
import { TokenTypes } from '@shared/Types/tokens';
import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ResendOtpController {
  constructor(
    @inject(TokenTypes.IResendOtpUseCase)
    private readonly resendOtpUseCase: IResendOtpUseCase,
  ) {}
  async resend(req: Request, res: Response): Promise<Response | void> {
    const { email } = req.body;
    logger.info('resend otp req arrived');
    const result = await this.resendOtpUseCase.execute({ email });

    const response: ApiResponse<ResendOtpResponseDTO> = {
      success: true,
      message: result.message,
      data: result,
    };

    return res.status(Http_StatusCodes.OK).json(response);
  }
}




// How errors are handled: 
// 1- resendOtpUseCase.execute() throws InvalidOtpError
// 2- Controller doesn't catch it (no try-catch blok)
// 3- Error bubbles up to asyncHandlerFunction
// 4- asyncHandlerFunction catches it with .catch(next blovk)
// 5- next(error) is called
// 6- ErrorHandlerMiddleWare.handleError() processes it
// 7- Middleware returns ApiResponse with correct status/code