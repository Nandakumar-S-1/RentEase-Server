import { LoginRequestDTO } from 'application/dtos/authentication/request/login-request.dto';
import { LoginResponseDTO } from 'application/dtos/authentication/response/login-response.dto';
import { ILoginUserUseCase } from 'application/interfaces/auth/login-user.usecase.interface';
import { IHashService } from 'application/interfaces/services/hash.service.interface';
import { IJwtService } from 'application/interfaces/services/jwt.service.interface';
import { IUserRepository } from 'core/interfaces/user-repository.interface';
import {
    AccountNotActiveError,
    AccountSuspendedError,
    EmailNotVerifiedError,
    InvalidCredentialsError,
} from 'shared/errors/login-errors';
import { logger } from 'shared/log/logger';
import { TokenTypes } from 'shared/types/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class LoginUseCase implements ILoginUserUseCase {
    constructor(
        @inject(TokenTypes.IUserRepository)
        private readonly _userRepository: IUserRepository,

        @inject(TokenTypes.IHashService)
        private readonly _hashService: IHashService,

        @inject(TokenTypes.IJwtService)
        private readonly _jwtService: IJwtService,
    ) {}
    async execute(dto: LoginRequestDTO): Promise<LoginResponseDTO> {
        logger.info('login usecase started----');
        if (!dto.email || !dto.password) {
            throw new InvalidCredentialsError();
        }
        const user = await this._userRepository.findByEmail(dto.email);
        if (!user) {
            logger.warn('user with this email does not exist');
            throw new InvalidCredentialsError();
        }
        if (!user.isEmailVerified) {
            logger.warn('the provided email is not verified');
            throw new EmailNotVerifiedError();
        }
        if (!user.isActive) {
            logger.warn('account with the provided email is deactivated');
            throw new AccountNotActiveError();
        }
        if (user.isSuspended) {
            logger.warn('account is suspende');
            throw new AccountSuspendedError();
        }

        const isValidPassword = await this._hashService.compare(dto.password, user.password);
        if (!isValidPassword) {
            logger.warn('Written password is incorrect');
            throw new InvalidCredentialsError();
        }

        logger.info('Login succesfull.');
        const token = this._jwtService.createPairofJwtTokens({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        logger.info('tokens for the user has created');
        return {
            user,
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
        };
    }
}
