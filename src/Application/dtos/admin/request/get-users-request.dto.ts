import { userType } from 'shared/types/role.types';

export interface IGetUsersRequestDTO {
    page?: number;
    limit?: number;
    role?: userType;
}
