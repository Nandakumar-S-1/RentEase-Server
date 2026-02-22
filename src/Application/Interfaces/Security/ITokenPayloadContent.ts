import { UserRole } from '@shared/Enums/user.role.type';

export interface ITokenPayloadContent {
  userId: string;
  email: string;
  role: UserRole;
}

export interface ITokenTypes {
  accessToken: string;
  refreshToken: string;
}
