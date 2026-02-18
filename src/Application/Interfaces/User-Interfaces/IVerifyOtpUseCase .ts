import { IVerifyOtpRequestDTO } from "@application/Data-Transfer-Object/Authentication/Request/VerifyOtpRequestDTO ";
// import { UserEntity } from "@core/Entities/user.entity";
import { UserRole } from "@shared/Enums/user.role.type";

export interface IVerifyOtpUseCase{
    execute(dto:IVerifyOtpRequestDTO):Promise<{
        user:{
            id:string,
            email:string,
            fullname:string,
            phone:string,
            role:UserRole
        }; 
        refreshToken:string;
        accessToken:string
    }>
}