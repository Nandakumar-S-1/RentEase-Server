import { LoginRequestDTO } from "@application/Data-Transfer-Object/Authentication/Request/LoginRequestDTO";
import { LoginResponseDTO } from "@application/Data-Transfer-Object/Authentication/Response/LoginResponseDTO";

export interface ILoginUserUseCase{
    execute(dto:LoginRequestDTO):Promise<LoginResponseDTO>
}