import { IVerifyOtpUseCase } from "@application/Interfaces/User-Interfaces/IVerifyOtpUseCase ";
import { inject, injectable } from "tsyringe";
import {Request,Response} from 'express'
import { logger } from "@shared/Log/logger";
import { Http_StatusCodes } from "@shared/Enums/Http_StatusCodes";
import { ProjectErrors } from "@shared/Errors/Base/BaseError";

@injectable()
export class VerifyOtpController{
    constructor(
        @inject('IVerifyOtpUseCase')
        private readonly verifyOtpUseCase:IVerifyOtpUseCase
    ){}

    async verify(req:Request,res:Response):Promise<Response>{
        try {
            const {email,otp}=req.body
            logger.info(`otp verification req on ${email}`)

            const result = await this.verifyOtpUseCase.execute({
                email,
                otp
            })
            return res.status(Http_StatusCodes.OK).json({
                success:true,
                message:'Email verified Successfully',
                data:{
                    id:result.user.id,
                    email:result.user.email,
                    fullname:result.user.fullname,
                    phone:result.user.phone,
                    role:result.user.role
                },
                accessToken:result.accessToken,
                refreshToken:result.refreshToken
            })

        } catch (error) {
            logger.error({error},'otp verification failed')

            if(error instanceof ProjectErrors){
                return res.status(error.statusCode).json({
                    success:false,
                    message:error.message,
                    code:error.code
                })
            }

            return res.status(Http_StatusCodes.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:'something went wrong'
            })
        }
    }

}