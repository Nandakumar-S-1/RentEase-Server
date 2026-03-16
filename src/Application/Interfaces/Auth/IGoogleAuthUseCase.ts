import { GoogleAuthRequestDTO } from "@application/Data-Transfer-Object/Authentication/Request/GoogleAuthRequestDTO";
import { LoginResponseDTO } from "@application/Data-Transfer-Object/Authentication/Response/LoginResponseDTO";

export interface IGoogleAuthUseCase{
    execute(dto:GoogleAuthRequestDTO):Promise<LoginResponseDTO>
}