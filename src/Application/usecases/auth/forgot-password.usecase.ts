import { ForgotPasswordRequestDto } from 'application/dtos/authentication/request/forgot-password-request.dto';
import { IForgotPasswordUseCase } from 'application/interfaces/auth/forgot-password.usecase.interface';
import { IMailService } from 'application/interfaces/services/mail.service.interface';
import { IOtpService } from 'application/interfaces/services/otp.service.interface';
import { IRedisCache } from 'application/interfaces/services/redis-cache.service.interface';
import { IUserRepository } from 'core/interfaces/user-repository.interface';
import { InvalidCredentialsError } from 'shared/errors/login-errors';
import { logger } from 'shared/log/logger';
import { TokenTypes } from 'shared/types/tokens';
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
    ) {}

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
