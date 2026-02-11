import { Create_User_Usecase } from '@application/UseCases/Authentication/Register/CreateUser.usecase';
import { Request, Response } from 'express';
import { Http_StatusCodes } from 'Shared/Enums/Http_StatusCodes';
import { inject, injectable } from 'tsyringe';
import { ICreateUserUseCase } from '@application/Interfaces/User-Interfaces/ICreateUserUseCase';

@injectable()
export class UserRegisterController {
  //basically here in this controller, it dont know to create user. //it it has only one idea where it has a createuser object with execute method in it.
  //controller receives its dependency through the constructor     //Create_User_Usecase is abstraction not db, so here comes Dependency Inversion Principle

  constructor(@inject('ICreateUserUseCase') private readonly createUser: ICreateUserUseCase) {} // inject using the token  defined in UseCaseModule     //the controllers is only need to do receve http request, extract data from the req body, // pass it to the corresponding use case and format respone to json .

  async register(req: Request, res: Response): Promise<Response> {
    try {
      console.log('registed data from frontend', req.body);

      const user = await this.createUser.execute(req.body);
      return res.status(Http_StatusCodes.CREATED).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      return res.status(Http_StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.message,
      });
    }
  }
}
