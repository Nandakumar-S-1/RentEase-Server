export interface UpdateProfileDTO {
    userId: string;
    role: string;
    fullName?: string;
    phone?: string;
    bio?: string;
    occupation?: string;
}
