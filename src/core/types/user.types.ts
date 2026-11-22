import { UserRole } from 'shared/enums/user-role.enum';

export interface UserTypeData {
    id: string;
    email: string;
    fullname: string;
    passwordHash: string;
    phone: string | null;
    role: UserRole;
    isActive?: boolean;
    isSuspended?: boolean;
    isEmailVerified?: boolean;
    avatarUrl?: string | null;
    verificationStatus?: string;
    createdAt?: Date;
}
