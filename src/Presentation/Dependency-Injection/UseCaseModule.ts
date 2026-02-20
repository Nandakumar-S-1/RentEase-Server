import { Create_User_Usecase } from '@application/UseCases/Authentication/CreateUser.usecase';
import { ICreateUserUseCase } from '@application/Interfaces/Auth/ICreateUserUseCase';
import { container } from 'tsyringe';
import { IVerifyOtpUseCase } from '@application/Interfaces/Auth/IVerifyOtpUseCase ';
import { VerifyOtpUseCase } from '@application/UseCases/Authentication/VerifyOtp.usecase';

export class UseCaseModule {
  static registerModules(): void {
    //registering interface token to the concrete class
    container.register<ICreateUserUseCase>('ICreateUserUseCase', {
      useClass: Create_User_Usecase,
    });
    container.register<IVerifyOtpUseCase>('IVerifyOtpUseCase', {
      useClass: VerifyOtpUseCase,
    });
  }
}
