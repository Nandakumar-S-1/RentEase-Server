import { Create_User_Usecase } from '@application/UseCases/Authentication/Register/CreateUser.usecase'
import { Request, Response } from 'express'
import { Http_StatusCodes } from 'Shared/Enums/Http_StatusCodes'

export class UserRegisterController {
    //basically here in this controller, it dont know to create user.
    //it it has only one idea where it has a createuser object with execute method in it.

    //controller receives its dependency through the constructor
    //Create_User_Usecase is abstraction not db, so here comes Dependency Inversion Principle
    constructor(private readonly createUser: Create_User_Usecase) {

    }
    //the controllers is only need to do receve http request, extract data from the req body,
    // pass it to the corresponding use case and format respone to json .

    async register(req: Request, res: Response): Promise<Response> {
        try {
            //controller receives its dependency through the constructor
            const user = await this.createUser.execute(req.body)
            return res.status(Http_StatusCodes.CREATED).json({
                success: true,
                data: user
            })
        } catch (error: any) {
            return res.status(Http_StatusCodes.BAD_REQUEST).json({
                success: false,
                message: error.message
            })
        }
    }
}
