import { ForgotPasswordRequestDto } from 'application/dtos/authentication/request/forgot-password-request.dto';

export interface IForgotPasswordUseCase {
    execute(dto: ForgotPasswordRequestDto): Promise<void>;
}
