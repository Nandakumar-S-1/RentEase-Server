import { LoginRequestDTO } from "@application/Data-Transfer-Object/Authentication/Request/LoginRequestDTO";
import { LoginResponseDTO } from "@application/Data-Transfer-Object/Authentication/Response/LoginResponseDTO";
import { ILoginUserUseCase } from "@application/Interfaces/Auth/ILoginUserUseCase";
import { IHashService } from "@application/Interfaces/Services/IHashService";
import { IJwtService } from "@application/Interfaces/Services/IJwtService";
import { IUserRepository } from "@core/Interfaces/IUserRepository";
import { AccountNotActiveError, AccountSuspendedError, EmailNotVerifiedError, InvalidCredentialsError } from "@shared/Errors/Login_Errors";
import { logger } from "@shared/Log/logger";
import { TokenTypes } from "@shared/Types/tokens";
import { inject, injectable } from "tsyringe";

@injectable()
export class LoginUseCase implements ILoginUserUseCase{
    constructor(
        @inject(TokenTypes.IUserRepository)
        private readonly userReposiory:IUserRepository,

        @inject(TokenTypes.IHashService)
        private readonly hashService:IHashService,

        @inject(TokenTypes.IJwtService)
        private readonly jwtService:IJwtService



    ) {

    }
    async execute(dto: LoginRequestDTO): Promise<LoginResponseDTO> {
        logger.info('login usecase started----')
        if(!dto.email||!dto.password){
            throw new InvalidCredentialsError()
        }
        const user = await this.userReposiory.findByEmail(dto.email)
        if(!user){
            logger.warn('user with this email does not exist')
            throw new InvalidCredentialsError()
        }
        if(!user.isEmailVerified){
            logger.warn('the provided email is not verified')
            throw new EmailNotVerifiedError()
        }
        if(!user.isActive){
            logger.warn('account with the provided email is deactivated')
            throw new AccountNotActiveError()
        }
        if(user.isSuspended){
            logger.warn('account is suspende')
            throw new AccountSuspendedError()
        }

        const isValidPassword= await this.hashService.compare(dto.password,user.password)
        if(!isValidPassword){
            logger.warn('Written password is incorrect')
            throw new InvalidCredentialsError()
        }

        logger.info('Login succesfull.')
        const token=this.jwtService.createPairofJwtTokens({
            userId:user.id,
            email:user.email,
            role:user.role
        })
        logger.info('tokens for the user has created')
        return {
            user,
            accessToken:token.accessToken,
            refreshToken:token.refreshToken
        }
    }
}