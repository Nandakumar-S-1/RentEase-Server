import { UserEntity } from "@core/Entities/user.entity";

export interface LoginResponseDTO{
    user:UserEntity,
    accessToken:string,
    refreshToken:string
}