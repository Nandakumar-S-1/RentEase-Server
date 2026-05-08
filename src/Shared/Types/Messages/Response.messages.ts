export const Common_Response_Messages = {
    INTERNAL_SERVER_ERROR: 'An unexpected error occurred',
    NOT_FOUND: 'The requested resource was not found',
    UNAUTHORIZED: 'Authentication required. Please log in.',
    FORBIDDEN: 'You do not have permission to perform this action',
    BAD_REQUEST: 'Invalid request data',
} as const;

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
    USER_NOT_FOUND: 'User not found',
    OTP_EXPIRED: 'OTP might be expired or not found',
    INVALID_OTP: 'Invalid OTP, try again',
    OTP_REQUIRED: 'OTP should be verified first',
    USER_AUTH_ACTIVE: 'User is authenticated and active',
    OTP_RESENT_WITH_EXPIRY: 'otp has been resent to your email, it will expire in 5 min',
    ACCESS_DENIED_ADMIN: 'Access denied. Only administrators can log in here.',
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
    LOGIN_SUCCESS: 'Admin login successful',
    REJECTION_REASON_TOO_SHORT: 'Rejection reason must be at least 10 characters long',
} as const;

export const Profile_Response_Messages = {
    FETCHED: 'Profile fetched successfully',
    UPDATED: 'Profile updated successfully',
    AVATAR_UPLOADED: 'Avatar uploaded successfully',
} as const;

export const Property_Response_Messages = {
    CREATED: 'Property created successfully',
    FETCHED: 'Properties fetched successfully',
    PHOTOS_UPLOADED: 'Property photos uploaded successfully',
    FILES_REQUIRED: 'Atleast one file is required',
    S3_CONFIG_ERROR: 'Storage service configuration error',
    UPDATED: 'Property updated successfully',
    UNLISTED: 'Property unlisted successfully',
    DELETED: 'Property deleted successfully',
    APPROVED: 'Property approved successfully',
    REJECTED: 'Property rejected successfully',
    RELISTED: 'Property relisted successfully',
    MODERATION_FAILED: 'One or more images failed safety moderation',
    SAFETY_CHECK_FAILED: 'Failed to perform safety check on property images.',
} as const;

export const ServiceProvider_Response_Messages = {
    ADDED: 'Service provider added successfully',
    FETCHED: 'Service providers fetched successfully',
    DELETED: 'Service provider deleted successfully',
    STATUS_UPDATED: 'Status updated successfully',
} as const;
