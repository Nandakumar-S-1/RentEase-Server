import { IFirebaseService } from "@application/Interfaces/Services/IFirebaseService";
import { IJwtService } from "@application/Interfaces/Services/IJwtService";
import { UserEntity } from "@core/Entities/user.entity";
import { IUserRepository } from "@core/Interfaces/IUserRepository";
import { UserRole } from "@shared/Enums/user.role.type";
import { TokenTypes } from "@shared/Types/tokens";
import { inject, injectable } from "tsyringe";

@injectable()
export class GoogleAuthUseCase {
    constructor(
        @inject(TokenTypes.IUserRepository)
        private readonly userRepository: IUserRepository,
        @inject(TokenTypes.IFirebaseService)
        private readonly firebaseService: IFirebaseService,
        @inject(TokenTypes.IJwtService)
        private readonly jwtService: IJwtService
    ) { }

    async execute(idToken: string, selectedRole: UserRole) {
        const { email, fullname } = await this.firebaseService.verifyIdToken(idToken);

        let user = await this.userRepository.findByEmail(email);

        if (!user) {
            user = UserEntity.create({
                id: crypto.randomUUID(),
                email,
                fullname,
                passwordHash: 'GOOGLE_AUTH_RANDOM_PASSWORD_FOR_HASH',
                phone: 'N/A',
                role: selectedRole,
                isEmailVerified: true
            });
            await this.userRepository.create(user);
        }

        const tokens = this.jwtService.createPairofJwtTokens({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        return {
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        };
    }
}