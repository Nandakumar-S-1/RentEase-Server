import { Create_User_Usecase } from '@application/UseCases/Authentication/Register/CreateUser.usecase';
import { ICreateUserUseCase } from '@application/Interfaces/User-Interfaces/ICreateUserUseCase';
import { container } from 'tsyringe';

export class UseCaseModule {
  static registerModules(): void {
    //registering interface token to the concrete class
    container.register<ICreateUserUseCase>('ICreateUserUseCase', {
      useClass: Create_User_Usecase,
    });
  }
}
