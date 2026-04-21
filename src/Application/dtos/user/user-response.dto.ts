export interface UserResponseDTO {
    id: string;
    email: string;
    fullname: string;
    phone: string | null;
    role: string;
    avatarUrl: string | null;
    isSuspended: boolean;
    isActive: boolean;
    isEmailVerified: boolean;
}
