import { LoginRequestDTO } from 'application/dtos/authentication/request/login-request.dto';
import { LoginResponseDTO } from 'application/dtos/authentication/response/login-response.dto';

export interface ILoginUserUseCase {
    execute(dto: LoginRequestDTO): Promise<LoginResponseDTO>;
}
