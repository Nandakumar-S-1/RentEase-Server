import { GoogleAuthRequestDTO } from 'application/dtos/authentication/request/google-auth-request.dto';
import { LoginResponseDTO } from 'application/dtos/authentication/response/login-response.dto';
import { IGoogleAuthUseCase } from 'application/interfaces/auth/google-auth.usecase.interface';
import { IFirebaseService } from 'application/interfaces/services/firebase.service.interface';
import { IJwtService } from 'application/interfaces/services/jwt.service.interface';
import { UserEntity } from 'core/entities/user.entity';
import { IUserRepository } from 'core/interfaces/user-repository.interface';
import { IOwnerProfileRepository } from 'core/interfaces/owner-repository.interface';
import { OwnerProfileEntity } from 'core/entities/owner-profile.entity';
import { UserRole } from 'shared/enums/user-role.enum';
import { logger } from 'shared/log/logger';
import { TokenTypes } from 'shared/types/tokens';
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
    ) {}

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
