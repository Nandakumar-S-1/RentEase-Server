export const AUTH_ROUTES = {
    REGISTER: '/register',
    LOGIN: '/login',
    VERIFY_OTP: '/verify-otp',
    RESEND_OTP: '/resend-otp',
    FORGOT_PASSWORD: '/forgot-password',
    VERIFY_RESET_OTP: '/verify-reset-otp',
    RESET_PASSWORD: '/reset-password',
    GOOGLE_AUTH: '/google-auth',
    REFRESH_TOKEN: '/refresh-token',
} as const;

export const ADMIN_ROUTES = {
    LOGIN: '/login',
    USERS: '/users',
    VERIFY_OWNER: '/verify-owner',
} as const;

export const API_PREFIXES = {
    AUTH: '/users',
    ADMIN: '/admin',
} as const;
