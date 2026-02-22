import { Create_User_Usecase } from '@application/UseCases/Authentication/CreateUser.usecase';
import { ICreateUserUseCase } from '@application/Interfaces/Auth/ICreateUserUseCase';
import { container } from 'tsyringe';
import { IVerifyOtpUseCase } from '@application/Interfaces/Auth/IVerifyOtpUseCase ';
import { VerifyOtpUseCase } from '@application/UseCases/Authentication/VerifyOtp.usecase';
import { IResendOtpUseCase } from '@application/Interfaces/Auth/IResendOtpUseCase';
import { TokenTypes } from '@shared/Types/tokens';
import { ResendOtpUseCase } from '@application/UseCases/Authentication/ResendOtp.usecase';
import { ILoginUserUseCase } from '@application/Interfaces/Auth/ILoginUserUseCase';
import { LoginUseCase } from '@application/UseCases/Authentication/LoginUser.usecase';

export class UseCaseModule {
  static registerModules(): void {
    //registering interface token to the concrete class
    container.register<ICreateUserUseCase>(TokenTypes.ICreateUserUseCase, {
      useClass: Create_User_Usecase,
    });
    container.register<IVerifyOtpUseCase>(TokenTypes.IVerifyOtpUseCase, {
      useClass: VerifyOtpUseCase,
    });
    container.register<IResendOtpUseCase>(TokenTypes.IResendOtpUseCase,{
      useClass:ResendOtpUseCase
    })
    container.register<ILoginUserUseCase>(TokenTypes.ILoginUseCase,{
      useClass:LoginUseCase
    })
  }
}
