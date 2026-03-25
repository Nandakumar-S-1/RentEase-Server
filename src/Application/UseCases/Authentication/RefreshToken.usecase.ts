import { IRefreshTokenUseCase } from '@application/Interfaces/Auth/IRefreshTokenUseCase';
import { IJwtService } from '@application/Interfaces/Services/IJwtService';
import { IUserRepository } from '@core/Interfaces/IUserRepository';
import { Http_StatusCodes } from '@shared/Enums/Http_StatusCodes';
import { ProjectErrors } from '@shared/Errors/Base/BaseError';
import { InvalidRefreshToken } from '@shared/Errors/JWT_Errors';
import { logger } from '@shared/Log/logger';
import { TokenTypes } from '@shared/Types/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    constructor(
        @inject(TokenTypes.IJwtService)
        private readonly _jwtService: IJwtService,

        @inject(TokenTypes.IUserRepository)
        private readonly _userRepository: IUserRepository,
    ) { }
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
                'ACCOUNT_DEACTIVATED',
                'Account is deactivated',
            );
        }

        if (user.isSuspended) {
            throw new ProjectErrors(
                Http_StatusCodes.UN_AUTHORIZED,
                'ACCOUNT_SUSPENDED',
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
