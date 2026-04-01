import { Response } from 'express';

export const setRefreshTokenCookie = (res: Response, refreshToken?: string): void => {
    if (!refreshToken) return;
    
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};
