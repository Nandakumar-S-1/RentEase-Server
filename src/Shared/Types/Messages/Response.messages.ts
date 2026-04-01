export const Auth_Response_Messages = {
    REGISTER_SUCCESS: 'User registered successfully. Check your email for OTP.',
    LOGIN_SUCCESS: 'Login is successful',
    OTP_VERIFIED: 'OTP verified successfully',
    OTP_RESENT: 'OTP has been resent to your email',
    PASSWORD_RESET_OTP_SENT: 'Password reset OTP sent to your email',
    PASSWORD_RESET_SUCCESS: 'Password has been reset successfully',
    TOKEN_REFRESHED: 'Token refreshed successfully',
    LOGOUT_SUCCESS: 'Logged out successfully',
    GOOGLE_LOGIN_SUCCESS: 'Google Login is Successful',
    MISSING_REFRESH_TOKEN: 'Refresh token is required',
} as const;

export const Owner_Response_Messages = {
    DOCUMENT_REQUIRED: 'Document file is required',
    DOCUMENT_SUBMITTED: 'Document submitted successfully',
    VERIFICATION_STATUS_FETCHED: 'Verification status fetched',
} as const;

export const Admin_Response_Messages = {
    OWNER_VERIFIED: 'Owner verified successfully',
    OWNER_REJECTED: 'Owner rejected',
    REJECTION_REASON_REQUIRED: 'Rejection reason should be included',
    PENDING_OWNERS_FETCHED: 'Fetched all pending owners',
} as const;

export const Profile_Response_Messages = {
    FETCHED: 'Profile fetched successfully',
    UPDATED: 'Profile updated successfully',
} as const;
