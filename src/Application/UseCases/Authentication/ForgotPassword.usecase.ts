import { ForgotPasswordRequestDto } from '@application/Data-Transfer-Object/Authentication/Request/ForgotPasswordDTO';
import { IForgotPasswordUseCase } from '@application/Interfaces/Auth/IForgotPasswordUseCase';
import { IMailService } from '@application/Interfaces/Services/IMailService';
import { IOtpService } from '@application/Interfaces/Services/IOtpService';
import { IRedisCache } from '@application/Interfaces/Services/IRedisCacheService';
import { IUserRepository } from '@core/Interfaces/IUserRepository';
import { InvalidCredentialsError } from '@shared/Errors/Login_Errors';
import { logger } from '@shared/Log/logger';
import { TokenTypes } from '@shared/Types/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
    constructor(
        @inject(TokenTypes.IUserRepository)
        private readonly _userRepository: IUserRepository,
        @inject(TokenTypes.IRedisCache)
        private readonly _redisService: IRedisCache,
        @inject(TokenTypes.IOtpService)
        private readonly _otpService: IOtpService,
        @inject(TokenTypes.IMailService)
        private readonly _mailService: IMailService,
    ) { }

    async execute(dto: ForgotPasswordRequestDto): Promise<void> {
        const user = await this._userRepository.findByEmail(dto.email);
        if (!user) {
            logger.warn('user with this mail doesnt exist');
            throw new InvalidCredentialsError();
        }
        const otp = this._otpService.generateOTP();
        const redisKey = `resetPassword_otp:${dto.email}`;

        await this._redisService.set(redisKey, otp, 300);
        await this._mailService.sendMail(
            dto.email,
            `Your Password reset OTP`,
            `Your OTP to reset Password is ${otp}`,
        );

        logger.info('password reset is succesgul');
    }
}
