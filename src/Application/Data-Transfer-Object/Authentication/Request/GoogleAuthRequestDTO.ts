import { UserRole } from '@shared/Enums/user.role.type';

export interface GoogleAuthRequestDTO {
    idToken: string;
    role: UserRole;
}
