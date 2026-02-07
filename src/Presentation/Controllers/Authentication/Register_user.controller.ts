import { Create_User_Usecase } from '@application/UseCases/Authentication/Register/CreateUser.usecase'
import {Request,Response} from 'express'
import { Http_StatusCodes } from 'Shared/Enums/Http_StatusCodes'

export class UserRegisterController{
    constructor(private readonly createUser:Create_User_Usecase){

    }
    async register(req:Request,res:Response):Promise<Response>{
        try {
            const user = await this.createUser.execute(req.body)
            return res.status(Http_StatusCodes.CREATED).json({
                success:true,
                data:user
            })
        } catch (error:any) {
            return res.status(Http_StatusCodes.BAD_REQUEST).json({
                success:false,
                message:error.message
            })
        }
    }
}
