import { ResendOtpRequestDTO } from "@application/Data-Transfer-Object/Authentication/Request/ResendOtpRequestDTO";
import { ResendOtpResponseDTO } from "@application/Data-Transfer-Object/Authentication/Response/ResendOtpResponseDTO";
import { IResendOtpUseCase } from "@application/Interfaces/Auth/IResendOtpUseCase";
import { IMailService } from "@application/Interfaces/Services/IMailService ";
import { IOtpService } from "@application/Interfaces/Services/IOtpService";
import { IRedisCache } from "@application/Interfaces/Services/IRedisCacheService";
import { IUserRepository } from "@core/Interfaces/IUserRepository";
import { InvalidOtpError } from "@shared/Errors/OTP_Errors";
import { logger } from "@shared/Log/logger";
import { TokenTypes } from "@shared/Types/tokens";
import { inject, injectable } from "tsyringe";

@injectable()
export class ResendOtpUseCase implements IResendOtpUseCase{
    private readonly OTP_TTL =300
    private readonly RESEND_RATE_LIMIT=60

    constructor(
        @inject(TokenTypes.IUserRepository)
        private readonly userRepository:IUserRepository,

        @inject(TokenTypes.IRedisCache)
        private readonly redisCache:IRedisCache,

        @inject(TokenTypes.IOtpService)
        private readonly otpService:IOtpService,

        @inject(TokenTypes.IMailService)
        private readonly mailService:IMailService

    ) {
    }
    async execute(dto: ResendOtpRequestDTO): Promise<ResendOtpResponseDTO> {
        if(!dto.email)throw new InvalidOtpError('Email is required')

            const user = await this.userRepository.findByEmail(dto.email)
            if(!user){
                logger.warn(`user not found wiith this email`)
                throw new InvalidOtpError(`User not found`)
            }
            if(user.isEmailVerified)throw new InvalidOtpError('email is already verified')

            const rateLimitrKey = `otp:ratelimit:${dto.email}`
            const lastOtpResendTime = await this.redisCache.get(rateLimitrKey)

            if(lastOtpResendTime!==null){
                logger.warn(`rate limit exceeded for this mail`)
                throw new InvalidOtpError('Please wait a minute before trying again')
            }

            const resendedOTP = this.otpService.generateOTP()
            logger.info(`new otp for the mail is sent`)

            const otpKey=`otp:${dto.email}`
            await this.redisCache.set(otpKey,resendedOTP,this.OTP_TTL)
            logger.info(`otp stored in redis`)

            await this.redisCache.set(rateLimitrKey,Date.now().toString(),this.RESEND_RATE_LIMIT)

            const numberOfAttemptKey =`otp:attempts:${dto.email}`
            await this.redisCache.delete(numberOfAttemptKey)

            logger.info(`resend otp counter reset`)

            try {
                await this.mailService.sendMail(
                    user.email,
                    `Your new OTP Code is`,
                    `your otp code is:${resendedOTP}`
                )
                logger.info(`otp sent to the email:${dto.email}`)
            } catch (error) {
                logger.error(`failed to sent email to:${dto.email}`)
                await this.redisCache.delete(otpKey)
                throw new Error('failedd to sent the OTP email')
            }
            return {
                message:`otp has been resent to your email, it will expire in 5 min`
            }
    }
}