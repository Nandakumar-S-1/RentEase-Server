import { Create_User_Usecase } from 'application/usecases/auth/create-user.usecase';
import { ICreateUserUseCase } from 'application/interfaces/auth/create-user.usecase.interface';
import { container } from 'tsyringe';
import { IVerifyOtpUseCase } from 'application/interfaces/auth/verify-otp.usecase.interface';
import { VerifyOtpUseCase } from 'application/usecases/auth/verify-otp.usecase';
import { IResendOtpUseCase } from 'application/interfaces/auth/resend-otp.usecase.interface';
import { TokenTypes } from 'shared/types/tokens';
import { ResendOtpUseCase } from 'application/usecases/auth/resend-otp.usecase';
import { ILoginUserUseCase } from 'application/interfaces/auth/login-user.usecase.interface';
import { LoginUseCase } from 'application/usecases/auth/login-user.usecase';
import { IForgotPasswordUseCase } from 'application/interfaces/auth/forgot-password.usecase.interface';
import { ForgotPasswordUseCase } from 'application/usecases/auth/forgot-password.usecase';
import { UserManagementUseCase } from 'application/usecases/admin/user-management.usecase';
import { IUserManagement } from 'application/interfaces/admin/user-management.interface';
import { GoogleAuthUseCase } from 'application/usecases/auth/google-auth.usecase';
import { IRefreshTokenUseCase } from 'application/interfaces/auth/refresh-token.usecase.interface';
import { RefreshTokenUseCase } from 'application/usecases/auth/refresh-token.usecase';
import { SubmitVerificationUseCase } from 'application/usecases/owner/submit-verification.usecase';
import { VerifyOwnerUseCase } from 'application/usecases/owner/verify-owner.usecase';
import { IVerifyOwnerUseCase } from 'application/interfaces/admin/verify-owner.usecase.interface';
import { ISubmitVerificationUseCase } from 'application/interfaces/owner/submit-verification.usecase.interface';
import { IGetProfileUseCase, IUpdateProfileUseCase } from 'application/interfaces/profile/profile.usecase.interface';
import { GetProfileUseCase } from 'application/usecases/profile/get-profile.usecase';
import { UpdateProfileUseCase } from 'application/usecases/profile/update-profile.usecase';

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
            useClass: ResendOtpUseCase,
        });
        container.register<ILoginUserUseCase>(TokenTypes.ILoginUseCase, {
            useClass: LoginUseCase,
        });
        container.register<IForgotPasswordUseCase>(TokenTypes.IForgotPasswordUseCase, {
            useClass: ForgotPasswordUseCase,
        });
        container.register<IUserManagement>(TokenTypes.UserManagementUseCase, {
            useClass: UserManagementUseCase,
        });
        container.register<GoogleAuthUseCase>(TokenTypes.IGoogleAuthUseCase, {
            useClass: GoogleAuthUseCase,
        });

        container.register<IRefreshTokenUseCase>(TokenTypes.IRefreshTokenUseCase, {
            useClass: RefreshTokenUseCase,
        });
        container.register<ISubmitVerificationUseCase>(TokenTypes.SubmitVerificationUseCase, {
            useClass: SubmitVerificationUseCase,
        });
        container.register<IVerifyOwnerUseCase>(TokenTypes.VerifyOwnerUseCase, {
            useClass: VerifyOwnerUseCase,
        });
        container.register<IGetProfileUseCase>(TokenTypes.GetProfileUseCase, {
            useClass: GetProfileUseCase,
        });
        container.register<IUpdateProfileUseCase>(TokenTypes.UpdateProfileUseCase, {
            useClass: UpdateProfileUseCase,
        });
    }
}
