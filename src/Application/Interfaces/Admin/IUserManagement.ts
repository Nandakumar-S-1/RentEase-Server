import { IGetAllUsersDTO } from "@application/Data-Transfer-Object/Admin/Res/GetAllUsersDTO";

export interface IUserManagement {
    getUsers(page: number, limit: number, role?: 'TENANT' | 'OWNER'): Promise<{ users: IGetAllUsersDTO[]; total: number }>;
    suspendUser(userId: string): Promise<void>;
    activateUser(userId: string): Promise<void>;
    deactivateUser(userId: string): Promise<void>;
}