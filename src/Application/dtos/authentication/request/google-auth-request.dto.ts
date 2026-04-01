import { UserRole } from 'shared/enums/user-role.enum';

export interface GoogleAuthRequestDTO {
    idToken: string;
    role: UserRole;
}
