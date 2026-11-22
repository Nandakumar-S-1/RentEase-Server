import { ResendOtpRequestDTO } from 'application/dtos/authentication/request/resend-otp-request.dto';
import { ResendOtpResponseDTO } from 'application/dtos/authentication/response/resend-otp-response.dto';

export interface IResendOtpUseCase {
    execute(dto: ResendOtpRequestDTO): Promise<ResendOtpResponseDTO>;
}
