import { IRefreshTokenUseCase } from 'application/interfaces/auth/refresh-token.usecase.interface';
import { IJwtService } from 'application/interfaces/services/jwt.service.interface';
import { IUserRepository } from 'core/interfaces/user-repository.interface';
import { Http_StatusCodes } from 'shared/enums/http-status-codes.enum';
import { ProjectErrors } from 'shared/errors/base/base.error'; 
import { InvalidRefreshToken } from 'shared/errors/jwt-errors';
import { ErrorCodes } from 'shared/enums/error-codes.enum';
import { logger } from 'shared/log/logger';
import { TokenTypes } from 'shared/types/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    constructor(
        @inject(TokenTypes.IJwtService)
        private readonly _jwtService: IJwtService,

        @inject(TokenTypes.IUserRepository)
        private readonly _userRepository: IUserRepository,
    ) {}
    async execute(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        logger.info('refresh token usecase started----');
        const payload = this._jwtService.verifyTheRefreshToken(refreshToken);

        const user = await this._userRepository.findById(payload.userId);
        if (!user) {
            throw new InvalidRefreshToken();
        }
        if (!user.isActive) {
            throw new ProjectErrors(
                Http_StatusCodes.UN_AUTHORIZED,
                ErrorCodes.ACCOUNT_DEACTIVATED,
                'Account is deactivated',
            );
        }

        if (user.isSuspended) {
            throw new ProjectErrors(
                Http_StatusCodes.UN_AUTHORIZED,
                ErrorCodes.ACCOUNT_SUSPENDED,
                'Account has been suspended',
            );
        }
        const token = this._jwtService.createPairofJwtTokens({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        logger.info('New Pair of tokens has been issued for the user');

        return token;
    }
}
