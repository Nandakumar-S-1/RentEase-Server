import { ForgotPasswordRequestDto } from "@application/Data-Transfer-Object/Authentication/Request/ForgotPasswordDTO";

export interface IForgotPasswordUseCase{
    execute(dto:ForgotPasswordRequestDto):Promise<void>
}