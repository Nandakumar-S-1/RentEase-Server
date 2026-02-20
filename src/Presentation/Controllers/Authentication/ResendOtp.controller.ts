import { IResendOtpUseCase } from "@application/Interfaces/Auth/IResendOtpUseCase";
import { Http_StatusCodes } from "@shared/Enums/Http_StatusCodes";
import { logger } from "@shared/Log/logger";
import { TokenTypes } from "@shared/Types/tokens";
import { Request,Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class ResendOtpController{
    constructor(
        @inject(TokenTypes.IResendOtpUseCase)
        private readonly resendOtpUseCase:IResendOtpUseCase
    ){}
    async resend(req:Request,res:Response):Promise<Response>{
        try {
            const {email}=req.body
            logger.info('resend otp req arrived')
            const result =await this.resendOtpUseCase.execute({email})
            return res.status(Http_StatusCodes.OK).json({
                succes:true
            })
        } catch (error) {
            
        }
    }
}