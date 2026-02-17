import { IVerifyOtpDTO } from "@application/Data-Transfer-Object/Authentication/IVerifyOtpDTO ";
import { UserEntity } from "@core/Entities/user.entity";

export interface IVerifyOtpUseCase{
    execute(dto:IVerifyOtpDTO):Promise<{
        user:UserEntity; 
        refreshToken:string;
        accessToken:string
    }>
}