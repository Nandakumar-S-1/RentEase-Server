// import { ApiResponse } from "@application/Data-Transfer-Object/ApiResponseDTO";
// import { IForgotPasswordUseCase } from "@application/Interfaces/Auth/IForgotPasswordUseCase";
// import { Http_StatusCodes } from "@shared/Enums/Http_StatusCodes";
// import { TokenTypes } from "@shared/Types/tokens";
// import { inject, injectable } from "tsyringe";
// import { Request,Response } from "express";
// import { logger } from "@shared/Log/logger";
// @injectable()
// export class ForgotPasswordController{
//     constructor(
//         @inject(TokenTypes.IForgotPasswordUseCase)
//         private readonly forgotPasswordUsecase:IForgotPasswordUseCase
    
//     ){}

//     async execute(req:Request,res:Response):Promise<Response>{
//         const {email} = req.body
//         logger.info('req fof forgot pasword')
//         await this.forgotPasswordUsecase.execute({email})

//         const response :ApiResponse<null>={
//             success:true,
//             message:'Otp for password reset has been sent to email',
//             // data:null
//         }
//         return res.status(Http_StatusCodes.OK).json(response)
//     }
// }