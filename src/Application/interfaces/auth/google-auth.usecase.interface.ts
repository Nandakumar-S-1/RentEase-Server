import { GoogleAuthRequestDTO } from 'application/dtos/authentication/request/google-auth-request.dto';
import { LoginResponseDTO } from 'application/dtos/authentication/response/login-response.dto';

export interface IGoogleAuthUseCase {
    execute(dto: GoogleAuthRequestDTO): Promise<LoginResponseDTO>;
}
