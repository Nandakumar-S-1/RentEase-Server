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
    USERS: {
        BASE: '/users',
        SUSPEND:'/users/suspend/:id',
        ACTIVATE: '/users/activate/:id',
        DEACTIVATE: '/users/deactivate/:id',
    },
    OWNER_VERIFICATION:{
        PENDING:'/owners/pending',
        VERIFY: '/owners/:id/verify',
        REJECT: '/owners/:id/reject'
    }
} as const;

export const OWNER_ROUTES = {
  SUBMIT: '/submit-verification',
  STATUS: '/verification-status',
} as const;

export const API_PREFIXES = {
    AUTH: '/users',
    ADMIN: '/admin',
} as const;
