import { UserRole } from 'Shared/Enums/user.role.type';

export interface UserTypeData {
  id: string;
  email: string;
  fullname: string;
  passwordHash: string;
  phone: string;
  role: UserRole;
  isActive?: boolean;
  isSuspended?: boolean;
  isEmailVerified?: boolean;
  createdAt?: Date;
}
