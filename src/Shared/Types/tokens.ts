
//uses tokens insted of class is beacause interfaces doesnt exist at runtime. 
// so the tokens will be as identifiers used for DI

export const TokenTypes = {
    IUserRepository: 'IUserRepository',
    ICreateUserUseCase: 'ICreateUserUseCase',
    IVerifyOtpUseCase: 'IVerifyOtpUseCase',
    IHashService: 'IHashService',
    IOtpService: 'IOtpService',
    IMailService: 'IMailService',
    IRedisCache: 'IRedisCache',
    IJwtService: 'IJwtService',
    IResendOtpUseCase: 'IResendOtpUseCase',
    ILoginUseCase: 'ILoginUseCase',
    IForgotPasswordUseCase: 'IForgotPasswordUseCase',
    IFirebaseService: 'IFirebaseService',
    IGoogleAuthUseCase: 'IGoogleAuthUseCase',
    UserManagementUseCase: 'UserManagementUseCase',
    AdminUserManagementUseCase: 'AdminUserManagementUseCase',
    IRefreshTokenUseCase: 'IRefreshTokenUseCase',
    IOwnerProfileRepository: 'IOwnerProfileRepository',
    SubmitVerificationUseCase: 'SubmitVerificationUseCase',
    VerifyOwnerUseCase: 'VerifyOwnerUseCase',
};
