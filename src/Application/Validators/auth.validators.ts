import { z } from 'zod';

const fullname = z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name cannot exceed 50 characters');

const email = z
    .string()
    .trim()
    .email('Invalid email address')
    .max(50, 'Email cannot exceed 50 characters');

const password = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(30, 'Password cannot exceed 30 characters')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[a-z]/, 'Must include a lowercase letter')
    .regex(/\d/, 'Must include a number')
    .regex(/[^A-Za-z0-9]/, 'Must include a special character');

const phone = z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits');

const role = z.enum(['TENANT', 'OWNER']);

const otp = z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'OTP must be exactly 6 digits');

// dto validation schemas --------------------------------------------

export const registerSchema = z.object({
    email,
    fullname,
    password,
    phone,
    role,
});

export const loginSchema = z.object({
    email,
    password: z.string().min(1, 'Password is required'),
});

export const verifyOtpSchema = z.object({
    email,
    otp,
});

export const resendOtpSchema = z.object({
    email,
});

export const forgotPassSchema = z.object({
    email,
});

export const updatePassSchema = z.object({
    email,
    newPassword: password,
});

export const verifyResetOtpSchema = z.object({
    email,
    otp,
});

export const googleAuthSchema = z.object({
    idToken: z.string().min(1, 'ID Token cannot be empty'),
    role,
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token cannot be empty'),
});
