import { IVerifyOtpRequestDTO } from "@application/Data-Transfer-Object/Authentication/Request/VerifyOtpRequestDTO ";
import { IVerifyOtpUseCase } from "@application/Interfaces/User-Interfaces/IVerifyOtpUseCase ";
import { IRedisCache } from "@application/Interfaces/User-Interfaces/IRedisCacheService";
import { UserEntity } from "@core/Entities/user.entity";
import { IUserRepository } from "@core/Interfaces/IUserRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class VerifyOtpUseCasee implements IVerifyOtpUseCase{
    private readonly MAX_OTP_WRITE_ATTEMPTS = 5;
    private readonly OTP_ATTEMPT_TTL = 900

    constructor(
        @inject('IUserRepository')
        private readonly userRepository:IUserRepository,

        @inject('IRedisCache')
        private readonly redisCache:IRedisCache ,

        // @inject('IJwtService')
        // private readonly jwtService:


    ){}
    async execute(dto: IVerifyOtpRequestDTO): Promise<{ user: UserEntity; refreshToken: string; accessToken: string; }> {
        
    }
}