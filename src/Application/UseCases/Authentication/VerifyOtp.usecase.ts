import { IVerifyOtpRequestDTO } from '@application/Data-Transfer-Object/Authentication/Request/VerifyOtpRequestDTO ';
import { IVerifyOtpUseCase } from '@application/Interfaces/Auth/IVerifyOtpUseCase ';
import { IRedisCache } from '@application/Interfaces/Services/IRedisCacheService';
import { UserEntity } from '@core/Entities/user.entity';
import { IUserRepository } from '@core/Interfaces/IUserRepository';
import { inject, injectable } from 'tsyringe';
import { logger } from '@shared/Log/logger';
import { InvalidOtpError, MaxOtpAttemptError, OtpExpiredError } from '@shared/Errors/OTP_Errors';
// import { IJwtService } from '@application/Interfaces/User-Interfaces/IJwtService';
import { TokenTypes } from '@shared/Types/tokens';
import { IJwtService } from '@application/Interfaces/Services/IJwtService';
// import { JwtService } from '@infrastructure/Services/JwtService';

@injectable()
export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  private readonly MAX_OTP_WRITE_ATTEMPTS = 5;
  private readonly OTP_ATTEMPT_TTL = 900;

  constructor(
    @inject(TokenTypes.IUserRepository)
    private readonly userRepository: IUserRepository,

    @inject('IRedisCache')
    private readonly redisCache: IRedisCache,

    @inject('IJwtService')
    private readonly jwtService: IJwtService,
  ) {}

  private validateInputOfOTP(dto: IVerifyOtpRequestDTO): void {
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
      const currentAttemptsString = await this.redisCache.get(attemptKey);
      if (currentAttemptsString === null) {
        await this.redisCache.set(attemptKey, '1', this.OTP_ATTEMPT_TTL);
        return;
      }

      const currentAttempts = parseInt(currentAttemptsString, 10);

      if (currentAttempts >= this.MAX_OTP_WRITE_ATTEMPTS) {
        logger.warn(`alredy exceeded maximum OTP attempts for the email ${email}`);
        throw new MaxOtpAttemptError(`Maximum OTP verification Attempts reached`);
      }

      const newAttempt = currentAttempts + 1;
      await this.redisCache.set(attemptKey, newAttempt.toString(), this.OTP_ATTEMPT_TTL);

      logger.info(`otp attempt ${newAttempt} for email ${email}`);
    } catch (error) {
      if (error instanceof MaxOtpAttemptError) throw error;

      logger.error({ error }, 'error whicle checking otp ettemps');
      throw new Error('failed to verify otp attempts');
    }
  }

  private async retreveOtpFromRedis(email: string): Promise<string> {
    const otpKey = `otp:${email}`;
    try {
      const otp = await this.redisCache.get(otpKey);
      if (otp === null) {
        logger.warn('Otp isnt there in redis for this email---------');
        throw new OtpExpiredError('OTP has expired or does not exist. Please request a new one');
      }
      return otp;
    } catch (error) {
      if (error instanceof OtpExpiredError) throw error;

      logger.error(`error retreving otp from redis ${error}`);
      throw new Error(`failed retreviing otp`);
    }
  }

  private async clearRedisData(email: string): Promise<void> {
    const otpKey = `otp:${email}`;
    const attemptKey = `otp:attempts:${email}`;
    try {
      await this.redisCache.delete(otpKey);
      logger.info('otp deleted from redis');

      await this.redisCache.delete(attemptKey);
      logger.info(`the counter to attempt deleted from redisdb`);
    } catch (error) {
      logger.error({ error }, `error clearing redis data`);
    }
  }

  async execute(
    dto: IVerifyOtpRequestDTO,
  ): Promise<{ user: UserEntity; refreshToken: string; accessToken: string }> {
    logger.info(`otp verification with the main ${dto.email}`);
    this.validateInputOfOTP(dto);

    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      logger.warn(`user not found on the email ${dto.email}`);
      throw new Error('Email was verified already');
    }
    await this.checkAttemptsCount(dto.email);

    const storedOtpIs = await this.retreveOtpFromRedis(dto.email);
    if (storedOtpIs !== dto.otp) {
      logger.warn('Invalid otp attempt');
      throw new InvalidOtpError('Invalid Otp,please try again carefulluy');
    }

    logger.info('otp verified succesfully');
    user.setEmailVerified();

    const updatedUser = await this.userRepository.update(user.id, user);
    logger.info(`users email has been verified and updated`);

    await this.clearRedisData(dto.email);

    const tokens = this.jwtService.createPairofJwtTokens({
      userId: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    });
    logger.info(`tokens for ${updatedUser} created`);
    return {
      user: updatedUser,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
