import { UserRole } from 'shared/enums/user-role.enum';

export interface ITokenPayloadContent {
    userId: string;
    email: string;
    role: UserRole;
}

export interface ITokenTypes {
    accessToken: string;
    refreshToken: string;
}
