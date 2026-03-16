import { GoogleAuthRequestDTO } from '@application/Data-Transfer-Object/Authentication/Request/GoogleAuthRequestDTO';
import { LoginResponseDTO } from '@application/Data-Transfer-Object/Authentication/Response/LoginResponseDTO';
import { IGoogleAuthUseCase } from '@application/Interfaces/Auth/IGoogleAuthUseCase';
import { IFirebaseService } from '@application/Interfaces/Services/IFirebaseService';
import { IJwtService } from '@application/Interfaces/Services/IJwtService';
import { UserEntity } from '@core/Entities/user.entity';
import { IUserRepository } from '@core/Interfaces/IUserRepository';
import { logger } from '@shared/Log/logger';
import { TokenTypes } from '@shared/Types/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GoogleAuthUseCase implements IGoogleAuthUseCase {
  constructor(
    @inject(TokenTypes.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TokenTypes.IFirebaseService)
    private readonly firebaseService: IFirebaseService,
    @inject(TokenTypes.IJwtService)
    private readonly jwtService: IJwtService,
  ) {}


  async execute(dto:GoogleAuthRequestDTO):Promise<LoginResponseDTO> {
    const {idToken,role}=dto
    const { email, fullname } =
    await this.firebaseService.verifyIdToken(idToken);

  let user = await this.userRepository.findByEmail(email);

  if (!user) {
    const emailPrefix = email.split('@')[0];
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const uniquePhone = `${emailPrefix}_${randomSuffix}`;

    logger.info(`Creating new google user: ${email}`);

    const newUser = UserEntity.create({
      id: crypto.randomUUID(),
      email,
      fullname,
      passwordHash: 'GOOGLE_AUTH_RANDOM_PASSWORD_FOR_HASH',
      phone: uniquePhone,
      role: role,
      isEmailVerified: true,
    });

    user = await this.userRepository.create(newUser);
  }

  const tokens = this.jwtService.createPairofJwtTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user:{
      id:user.id,
      email:user.email,
      fullname:user.fullname,
      phone:user.fullname,
      role:user.role
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

//   async execute(idToken: string, selectedRole: UserRole) {
//     const { email, fullname } = await this.firebaseService.verifyIdToken(idToken);

//     let user = await this.userRepository.findByEmail(email);
//     if (!user) {
//       const emailPrefix = email.split('@')[0];
//       const randomSuffix = Math.random().toString(36).substring(2, 8);
//       const uniquePhone = `${emailPrefix}_${randomSuffix}`;

//       logger.info(`Creating new ggoogle user: ${email}`);

//       user = UserEntity.create({
//         id: crypto.randomUUID(),
//         email,
//         fullname,
//         passwordHash: 'GOOGLE_AUTH_RANDOM_PASSWORD_FOR_HASH',
//         phone: uniquePhone,
//         role: selectedRole,
//         isEmailVerified: true,
//       });

//       const tokens = this.jwtService.createPairofJwtTokens({
//         userId: user.id,
//         email: user.email,
//         role: user.role,
//       });

//       return {
//         user,
//         accessToken: tokens.accessToken,
//         refreshToken: tokens.refreshToken,
//       };
//     }
//   }
}
