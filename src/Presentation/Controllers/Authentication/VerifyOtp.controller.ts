import { IVerifyOtpUseCase } from '@application/Interfaces/Auth/IVerifyOtpUseCase ';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { logger } from '@shared/Log/logger';
import { Http_StatusCodes } from '@shared/Enums/Http_StatusCodes';
import { TokenTypes } from '@shared/Types/tokens';
import { ApiResponse } from '@application/Data-Transfer-Object/ApiResponseDTO';

@injectable()
export class VerifyOtpController {
  constructor(
    @inject(TokenTypes.IVerifyOtpUseCase)
    private readonly verifyOtpUseCase: IVerifyOtpUseCase,


  ) { }

  async verify(req: Request, res: Response): Promise<Response> {
      const { email, otp } = req.body;
      logger.info(`otp verification req on ${email}`);

      const result = await this.verifyOtpUseCase.execute({
        email,
        otp,
      });
      const response: ApiResponse<{
        user: {
          id: string,
          email: string,
          fullname: string,
          phone: string,
          role: string
        }
        accessToken: string,
        refreshToken: string
      }> = {
        success: true,
        message: 'Email verified Successfully',
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            fullname: result.user.fullname,
            phone: result.user.phone,
            role: result.user.role,
          },
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        }
      };
      return res.status(Http_StatusCodes.OK).json(response)
  }
}
