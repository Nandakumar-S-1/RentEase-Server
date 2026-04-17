import { UserEntity } from '@core/entities/user.entity';
import { LoginRequestDTO } from 'application/dtos/authentication/request/login-request.dto';

export type LoginResult = {
    user: UserEntity;
    accessToken: string;
    refreshToken: string;
};

export interface ILoginUserUseCase {
    execute(dto: LoginRequestDTO): Promise<LoginResult>;
}
