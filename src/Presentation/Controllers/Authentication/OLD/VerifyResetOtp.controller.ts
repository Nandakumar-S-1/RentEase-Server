// import { IRedisCache } from "@application/Interfaces/Services/IRedisCacheService";
// import { TokenTypes } from "@shared/Types/tokens";
// import { inject, injectable } from "tsyringe";
// import { Request,Response } from "express";
// import { logger } from "@shared/Log/logger";
// import { InvalidOtpError } from "@shared/Errors/OTP_Errors";
// import { ApiResponse } from "@application/Data-Transfer-Object/ApiResponseDTO";
// import { Http_StatusCodes } from "@shared/Enums/Http_StatusCodes";

// @injectable()
// export class VerifyResetOtpController{
//     constructor(
//         @inject(TokenTypes.IRedisCache)
//         private readonly redisCache:IRedisCache
//     ){}

//     async execute(req:Request,res:Response):Promise<Response>{
//         const {email,otp}=req.body
//         logger.info('verify reset otp gg')
//         const redisKey = `resetPassword_otp:${email}`
//         const storedOtp= await this.redisCache.get(redisKey)

//         if(!storedOtp){
//             throw new InvalidOtpError('Otp might be expired or not found')

//         }
//         if(storedOtp!==otp){
//             throw new InvalidOtpError('Written Otp is invalid, try again')
//         }

//         await this.redisCache.set(`resetPassword_verified:${email}`,'true',300)
//         await this.redisCache.delete(redisKey)

//         const response:ApiResponse<null>={
//             success:true,
//             message:'OTP succesfully verified'
//         }
//         return res.status(Http_StatusCodes.OK).json(response)
//     }
// }
