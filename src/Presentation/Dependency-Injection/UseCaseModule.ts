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
import { IForgotPasswordUseCase } from '@application/Interfaces/Auth/IForgotPasswordUseCase';
import { ForgotPasswordUseCase } from '@application/UseCases/Authentication/ForgotPassword.usecase';
import { UserManagementUseCase } from '@application/UseCases/Admin/UserManagement.usecase';
import { IUserManagement } from '@application/Interfaces/Admin/IUserManagement';
import { GoogleAuthUseCase } from '@application/UseCases/Authentication/GoogleAuth.usecase';
import { IRefreshTokenUseCase } from '@application/Interfaces/Auth/IRefreshTokenUseCase';
import { RefreshTokenUseCase } from '@application/UseCases/Authentication/RefreshToken.usecase';
import { SubmitVerificationUseCase } from '@application/UseCases/Owner/SubmitVerification.usecase';
import { VerifyOwnerUseCase } from '@application/UseCases/Owner/VerifyOwner.usecase';

export class UseCaseModule {
  static registerModules(): void {
    //registering interface token to the concrete class
    container.register<ICreateUserUseCase>(TokenTypes.ICreateUserUseCase, {
      useClass: Create_User_Usecase,
    });
    container.register<IVerifyOtpUseCase>(TokenTypes.IVerifyOtpUseCase, {
      useClass: VerifyOtpUseCase,
    });
    container.register<IResendOtpUseCase>(TokenTypes.IResendOtpUseCase, {
      useClass: ResendOtpUseCase
    })
    container.register<ILoginUserUseCase>(TokenTypes.ILoginUseCase, {
      useClass: LoginUseCase
    })
    container.register<IForgotPasswordUseCase>(TokenTypes.IForgotPasswordUseCase, {
      useClass: ForgotPasswordUseCase
    })
    container.register<IUserManagement>(TokenTypes.UserManagementUseCase, {
      useClass: UserManagementUseCase
    })
    container.register<GoogleAuthUseCase>(TokenTypes.IGoogleAuthUseCase, {
      useClass: GoogleAuthUseCase
    })

    container.register<IRefreshTokenUseCase>(TokenTypes.IRefreshTokenUseCase,{
      useClass:RefreshTokenUseCase
    })
    container.register(TokenTypes.SubmitVerificationUseCase,{
      useClass:SubmitVerificationUseCase
    })
    container.register(TokenTypes.VerifyOwnerUseCase,{
      useClass:VerifyOwnerUseCase
    })
  }
}
