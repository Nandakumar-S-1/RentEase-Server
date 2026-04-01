import { ResendOtpRequestDTO } from 'application/dtos/authentication/request/resend-otp-request.dto';
import { ResendOtpResponseDTO } from 'application/dtos/authentication/response/resend-otp-response.dto';
import { IResendOtpUseCase } from 'application/interfaces/auth/resend-otp.usecase.interface';
import { IMailService } from 'application/interfaces/services/mail.service.interface';
import { IOtpService } from 'application/interfaces/services/otp.service.interface';
import { IRedisCache } from 'application/interfaces/services/redis-cache.service.interface';
import { IUserRepository } from 'core/interfaces/user-repository.interface';
import { InvalidOtpError } from 'shared/errors/otp-errors';
import { logger } from 'shared/log/logger';
import { TokenTypes } from 'shared/types/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ResendOtpUseCase implements IResendOtpUseCase {
    private readonly _OTP_TTL = 300;
    private readonly _RESEND_RATE_LIMIT = 60;

    constructor(
        @inject(TokenTypes.IUserRepository)
        private readonly _userRepository: IUserRepository,

        @inject(TokenTypes.IRedisCache)
        private readonly _redisCache: IRedisCache,

        @inject(TokenTypes.IOtpService)
        private readonly _otpService: IOtpService,

        @inject(TokenTypes.IMailService)
        private readonly _mailService: IMailService,
    ) {}
    async execute(dto: ResendOtpRequestDTO): Promise<ResendOtpResponseDTO> {
        if (!dto.email) throw new InvalidOtpError('Email is required');

        const userInDb = await this._userRepository.findByEmail(dto.email);
        if (userInDb && userInDb.isEmailVerified) {
            throw new InvalidOtpError('email is already verified');
        }

        // If not verified in DB, check if there's a pending registration in Redis
        const pendingUser = await this._redisCache.get(`pending_user:${dto.email}`);
        if (!userInDb && !pendingUser) {
            logger.warn(`user not found with this email and no pending registration`);
            throw new InvalidOtpError(`User not found or registration expired`);
        }

        const rateLimitrKey = `otp:ratelimit:${dto.email}`;
        const lastOtpResendTime = await this._redisCache.get(rateLimitrKey);

        if (lastOtpResendTime !== null) {
            logger.warn(`rate limit exceeded for this mail`);
            throw new InvalidOtpError('Please wait a minute before trying again');
        }

        const resendedOTP = this._otpService.generateOTP();
        logger.info(`new otp for the mail is sent`);

        const otpKey = `otp:${dto.email}`;
        await this._redisCache.set(otpKey, resendedOTP, this._OTP_TTL);
        logger.info(`otp stored in redis`);

        await this._redisCache.set(rateLimitrKey, Date.now().toString(), this._RESEND_RATE_LIMIT);

        const numberOfAttemptKey = `otp:attempts:${dto.email}`;
        await this._redisCache.delete(numberOfAttemptKey);

        logger.info(`resend otp counter reset`);

        try {
            await this._mailService.sendMail(
                dto.email,
                `Your new OTP Code is`,
                `your otp code is:${resendedOTP}`,
            );
            logger.info(`otp sent to the email:${dto.email}`);
        } catch {
            logger.error(`failed to sent email to:${dto.email}`);
            await this._redisCache.delete(otpKey);
            throw new Error('failedd to sent the OTP email');
        }
        return {
            message: `otp has been resent to your email, it will expire in 5 min`,
        };
    }
}
