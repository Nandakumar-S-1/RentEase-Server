import { IVerifyOtpRequestDTO } from 'application/dtos/authentication/request/verify-otp-request.dto';
// import { UserEntity } from "@core/Entities/user.entity";
import { UserRole } from 'shared/enums/user-role.enum';

export interface IVerifyOtpUseCase {
    execute(dto: IVerifyOtpRequestDTO): Promise<{
        user: {
            id: string;
            email: string;
            fullname: string;
            phone: string | null;
            role: UserRole;
        };
        refreshToken: string;
        accessToken: string;
    }>;
}
