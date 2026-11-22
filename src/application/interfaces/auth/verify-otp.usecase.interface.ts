import { IVerifyOtpRequestDTO } from 'application/dtos/authentication/request/verify-otp-request.dto';
import { UserEntity } from 'core/entities/user.entity';

export interface IVerifyOtpUseCase {
    execute(dto: IVerifyOtpRequestDTO): Promise<{
        user: UserEntity;
        refreshToken: string;
        accessToken: string;
    }>;
}
