import { IVerifyOtpRequestDTO } from '@application/Data-Transfer-Object/Authentication/Request/VerifyOtpRequestDTO';
import { IVerifyOtpUseCase } from '@application/Interfaces/Auth/IVerifyOtpUseCase';
import { IRedisCache } from '@application/Interfaces/Services/IRedisCacheService';
import { UserEntity } from '@core/Entities/user.entity';
import { IUserRepository } from '@core/Interfaces/IUserRepository';
import { inject, injectable } from 'tsyringe';
import { logger } from '@shared/Log/logger';
import { InvalidOtpError, MaxOtpAttemptError, OtpExpiredError } from '@shared/Errors/OTP_Errors';

import { TokenTypes } from '@shared/Types/tokens';
import { IJwtService } from '@application/Interfaces/Services/IJwtService';
import { UserRole } from '@shared/Enums/user.role.type';
import { IOwnerProfileRepository } from '@core/Interfaces/IOwnerRepository';
import { OwnerProfileEntity } from '@core/Entities/OwnerProfileEntity.entity';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class VerifyOtpUseCase implements IVerifyOtpUseCase {
    private readonly _MAX_OTP_WRITE_ATTEMPTS = 5;
    private readonly _OTP_ATTEMPT_TTL = 900;

    constructor(
        @inject(TokenTypes.IUserRepository)
        private readonly _userRepository: IUserRepository,

        @inject(TokenTypes.IRedisCache)
        private readonly _redisCache: IRedisCache,

        @inject(TokenTypes.IJwtService)
        private readonly _jwtService: IJwtService,

        @inject(TokenTypes.IOwnerProfileRepository)
        private readonly _ownerRepository: IOwnerProfileRepository,
    ) {}

    private _validateInputOfOTP(dto: IVerifyOtpRequestDTO): void {
        if (!dto.email || !dto.otp) {
            throw new Error('Email and OTP required');
        }
        if (dto.email.trim().length === 0) {
            throw new Error('Email should not be Empty');
        }
        if (dto.otp.trim().length === 0) {
            throw new Error('OTP cannot be empty');
        }
        if (!/^\d{6}$/.test(dto.otp)) {
            throw new Error('OTP should be 6 digits');
        }
    }

    private async checkAttemptsCount(email: string): Promise<void> {
        const attemptKey = `otp:attempts:${email}`;
        try {
            const currentAttemptsString = await this._redisCache.get(attemptKey);
            if (currentAttemptsString === null) {
                await this._redisCache.set(attemptKey, '1', this._OTP_ATTEMPT_TTL);
                return;
            }

            const currentAttempts = parseInt(currentAttemptsString, 10);

            if (currentAttempts >= this._MAX_OTP_WRITE_ATTEMPTS) {
                logger.warn(`alredy exceeded maximum OTP attempts for the email ${email}`);
                throw new MaxOtpAttemptError(`Maximum OTP verification Attempts reached`);
            }

            const newAttempt = currentAttempts + 1;
            await this._redisCache.set(attemptKey, newAttempt.toString(), this._OTP_ATTEMPT_TTL);

            logger.info(`otp attempt ${newAttempt} for email ${email}`);
        } catch (error) {
            if (error instanceof MaxOtpAttemptError) throw error;

            logger.error({ error }, 'error whicle checking otp ettemps');
            throw new Error('failed to verify otp attempts');
        }
    }

    private async _retreveOtpFromRedis(email: string): Promise<string> {
        const otpKey = `otp:${email}`;
        try {
            const otp = await this._redisCache.get(otpKey);
            if (otp === null) {
                logger.warn('Otp isnt there in redis for this email---------');
                throw new OtpExpiredError(
                    'OTP has expired or does not exist. Please request a new one',
                );
            }
            return otp;
        } catch (error) {
            if (error instanceof OtpExpiredError) throw error;

            logger.error(`error retreving otp from redis ${error}`);
            throw new Error(`failed retreviing otp`);
        }
    }

    private async _clearRedisData(email: string): Promise<void> {
        const otpKey = `otp:${email}`;
        const attemptKey = `otp:attempts:${email}`;
        const pendingUserKey = `pending_user:${email}`;
        try {
            await this._redisCache.delete(otpKey);
            logger.info('otp deleted from redis');

            await this._redisCache.delete(attemptKey);
            logger.info(`the counter to attempt deleted from redisdb`);

            await this._redisCache.delete(pendingUserKey);
            logger.info('pending user deleted from redis');
        } catch (error) {
            logger.error({ error }, `error clearing redis data`);
        }
    }

    async execute(
        dto: IVerifyOtpRequestDTO,
    ): Promise<{ user: UserEntity; refreshToken: string; accessToken: string }> {
        logger.info(`otp verification with the main ${dto.email}`);
        this._validateInputOfOTP(dto);

        // Instead of findByEmail in DB, check edis for pending registration
        const pendingUserJson = await this._redisCache.get(`pending_user:${dto.email}`);
        if (!pendingUserJson) {
            // Check if user already exists in DB (maybe already verified)
            const existingUser = await this._userRepository.findByEmail(dto.email);
            if (existingUser) {
                throw new Error('Email was verified already');
            }
            throw new Error('Verification session expired or not found');
        }

        await this.checkAttemptsCount(dto.email);

        const storedOtpIs = await this._retreveOtpFromRedis(dto.email);
        if (storedOtpIs !== dto.otp) {
            logger.warn('Invalid otp attempt');
            throw new InvalidOtpError('Invalid Otp,please try again carefulluy');
        }

        logger.info('otp verified succesfully');

        // parse the pending user data
        const userData = JSON.parse(pendingUserJson);
        const user = UserEntity.create({
            ...userData,
            createdAt: new Date(userData.createdAt),
            isEmailVerified: true, // it willbe markd as verified before saving
        });

        // Save to ddb for the first time
        const newUser = await this._userRepository.create(user);
        if (newUser.role === UserRole.OWNER) {
            await this._ownerRepository.create(
                OwnerProfileEntity.create({ id: uuidv4(), userId: newUser.id }),
            );
        }
        logger.info(`users email has been verified and saved to database`);

        await this._clearRedisData(dto.email);

        const tokens = this._jwtService.createPairofJwtTokens({
            userId: newUser.id,
            email: newUser.email,
            role: newUser.role,
        });
        logger.info(`tokens for ${newUser.email} created`);
        return {
            user: newUser,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }
}
