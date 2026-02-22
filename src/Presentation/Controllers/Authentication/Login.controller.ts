import { ILoginUserUseCase } from "@application/Interfaces/Auth/ILoginUserUseCase";
import { TokenTypes } from "@shared/Types/tokens";
import { inject, injectable } from "tsyringe";
import {Request,Response} from 'express'
import { logger } from "@shared/Log/logger";
import { Http_StatusCodes } from "@shared/Enums/Http_StatusCodes";
import { ApiResponse } from "@application/Data-Transfer-Object/ApiResponseDTO";

@injectable()
export class LoginController{
    constructor(
        @inject(TokenTypes.ILoginUseCase)
        private readonly loginUseCase:ILoginUserUseCase
    ) {
        
    }
    async login(req:Request,res:Response):Promise<Response>{
            const {email,password}=req.body
            logger.info('requessted login')
            const result = await this.loginUseCase.execute({
                email,
                password
            })

            const respone :ApiResponse<{
                user:{id:string,email:string,fullname:string,phone:string,role:string},
                accessToken:string;
                refreshToken:string
            }> = {
                success:true,
                message:'Login is Success',
                data:{
                    user:{
                        id:result.user.id,
                        email:result.user.email,
                        fullname:result.user.fullname,
                        phone:result.user.phone,
                        role:result.user.role
                    },
                    accessToken:result.accessToken,
                    refreshToken:result.refreshToken
                }
            }
            return res.status(Http_StatusCodes.OK).json(respone)

    }
}