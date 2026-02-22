import { ResendOtpRequestDTO } from "@application/Data-Transfer-Object/Authentication/Request/ResendOtpRequestDTO";
import { ResendOtpResponseDTO } from "@application/Data-Transfer-Object/Authentication/Response/ResendOtpResponseDTO";

export interface IResendOtpUseCase{
    execute(dto:ResendOtpRequestDTO):Promise<ResendOtpResponseDTO>
}
