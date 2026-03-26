import { IGetAllUsersDTO } from '@application/Data-Transfer-Object/Admin/Res/GetAllUsersDTO';
import { userType } from '@shared/Types/role.types';

export interface IUserManagement {
    getUsers(variables: {
        page: number;
        limit: number;
        role?: userType;
    }): Promise<{ users: IGetAllUsersDTO[]; total: number }>;
    suspendUser(userId: string): Promise<void>;
    activateUser(userId: string): Promise<void>;
    deactivateUser(userId: string): Promise<void>;
}
