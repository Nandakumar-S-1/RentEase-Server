import { GoogleAuthRequestDTO } from 'application/dtos/authentication/request/google-auth-request.dto';
// import { LoginResponseDTO } from 'application/dtos/authentication/response/login-response.dto';
import { LoginResult } from './login-user.usecase.interface';

export interface IGoogleAuthUseCase {
    execute(dto: GoogleAuthRequestDTO): Promise<LoginResult>;
}
