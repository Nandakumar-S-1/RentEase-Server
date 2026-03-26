import { GoogleAuthRequestDTO } from '@application/Data-Transfer-Object/Authentication/Request/GoogleAuthRequestDTO';
import { LoginResponseDTO } from '@application/Data-Transfer-Object/Authentication/Response/LoginResponseDTO';
import { IGoogleAuthUseCase } from '@application/Interfaces/Auth/IGoogleAuthUseCase';
import { IFirebaseService } from '@application/Interfaces/Services/IFirebaseService';
import { IJwtService } from '@application/Interfaces/Services/IJwtService';
import { UserEntity } from '@core/Entities/user.entity';
import { IUserRepository } from '@core/Interfaces/IUserRepository';
import { IOwnerProfileRepository } from '@core/Interfaces/IOwnerRepository';
import { OwnerProfileEntity } from '@core/Entities/OwnerProfileEntity.entity';
import { UserRole } from '@shared/Enums/user.role.type';
import { logger } from '@shared/Log/logger';
import { TokenTypes } from '@shared/Types/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GoogleAuthUseCase implements IGoogleAuthUseCase {
    constructor(
        @inject(TokenTypes.IUserRepository)
        private readonly _userRepository: IUserRepository,
        @inject(TokenTypes.IFirebaseService)
        private readonly _firebaseService: IFirebaseService,
        @inject(TokenTypes.IJwtService)
        private readonly _jwtService: IJwtService,
        @inject(TokenTypes.IOwnerProfileRepository)
        private readonly _ownerRepository: IOwnerProfileRepository,
    ) { }

    async execute(dto: GoogleAuthRequestDTO): Promise<LoginResponseDTO> {
        const { idToken, role } = dto;
        const { email, fullname } = await this._firebaseService.verifyIdToken(idToken);

        let user = await this._userRepository.findByEmail(email);

        if (!user) {
            logger.info(`Creating new google user: ${email}`);

            const newUser = UserEntity.create({
                id: crypto.randomUUID(),
                email,
                fullname,
                passwordHash: 'GOOGLE_AUTH_RANDOM_PASSWORD_FOR_HASH',
                phone: null,
                role: role,
                isEmailVerified: true,
            });

            user = await this._userRepository.create(newUser);

            // Create OwnerProfile for OWNER users (same as VerifyOtp)
            if (user.role === UserRole.OWNER) {
                await this._ownerRepository.create(
                    OwnerProfileEntity.create({ id: crypto.randomUUID(), userId: user.id }),
                );
            }
        }

        const tokens = this._jwtService.createPairofJwtTokens({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                fullname: user.fullname,
                phone: user.phone ?? null,
                role: user.role,
            },
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }
}
