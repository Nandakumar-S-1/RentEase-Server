export interface LoginResponseDTO {
    user: {
        id: string;
        email: string;
        fullname: string;
        phone: string | null;
        role: string;
    };
    accessToken: string;
    refreshToken: string;
}
