import { UserRole } from "@shared/Enums/user.role.type";

export interface IGetAllUsersDTO {
    id: string,
    email: string,
    fullname: string,
    phone: string,
    role: UserRole,
    isEmailVerified: boolean,
    isActive: boolean,
    isSuspended: boolean,
    createdAt: Date
}
