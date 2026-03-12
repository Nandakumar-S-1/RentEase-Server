export interface LoginResponseDTO {
    user: {
        id: string;
        email: string;
        fullname: string;
        phone: string;
        role: string;
    },
    accessToken: string,
    refreshToken: string
}