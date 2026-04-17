export interface LoginResponseDTO {
    user: {
        id: string;
        email: string;
        fullname: string;
        phone: string | null;
        role: string;
        avatarUrl: string | null;
    };
    accessToken: string;
}
