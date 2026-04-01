import { IGetUsersRequestDTO } from 'application/dtos/admin/request/get-users-request.dto';
import { IGetAllUsersDTO } from 'application/dtos/admin/response/get-all-users-response.dto';

export interface IUserManagement {
    getUsers(dto: IGetUsersRequestDTO): Promise<{ users: IGetAllUsersDTO[]; total: number }>;
    suspendUser(userId: string): Promise<void>;
    activateUser(userId: string): Promise<void>;
    deactivateUser(userId: string): Promise<void>;
}
