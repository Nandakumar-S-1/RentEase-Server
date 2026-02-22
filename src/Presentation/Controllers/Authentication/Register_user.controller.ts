import { Request, Response } from 'express';
import { Http_StatusCodes } from 'Shared/Enums/Http_StatusCodes';
import { inject, injectable } from 'tsyringe';
import { ICreateUserUseCase } from '@application/Interfaces/Auth/ICreateUserUseCase';
import { TokenTypes } from '@shared/Types/tokens';
import { ApiResponse } from '@application/Data-Transfer-Object/ApiResponseDTO';

@injectable()
export class UserRegisterController {
  //basically here in this controller, it dont know to create user. //it it has only one idea where it has a createuser object with execute method in it.
  //controller receives its dependency through the constructor     //Create_User_Usecase is abstraction not db, so here comes Dependency Inversion Principle

  constructor(@inject(TokenTypes.ICreateUserUseCase) private readonly createUser: ICreateUserUseCase) {} // inject using the token  defined in UseCaseModule     //the controllers is only need to do receve http request, extract data from the req body, // pass it to the corresponding use case and format respone to json .

  register = async (req: Request, res: Response): Promise<Response> => {

      // console.log('registed data from frontend', req.body);
      const user = await this.createUser.execute(req.body);

      const respone : ApiResponse<unknown>={
         success: true,
         message: 'User registered successfully. Check your email for OTP.',
        data: {
          user:{
            id:user.id,
            email:user.email,
            fullname:user.fullname,
            phone:user.phone,
            role:user.role
          }
        }
      }
      return res.status(Http_StatusCodes.CREATED).json(respone);
  };
}
