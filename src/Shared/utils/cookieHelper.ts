import { Response } from 'express';

const REFRESH_COOKIE_NAME = 'refreshToken';

const secureCookie = process.env.NODE_ENV === 'production';

export const clearRefreshTokenCookie = (res: Response): void => {
    const base = { httpOnly: true, secure: secureCookie, path: '/' } as const;
    res.clearCookie(REFRESH_COOKIE_NAME, { ...base, sameSite: 'lax' });
    res.clearCookie(REFRESH_COOKIE_NAME, { ...base, sameSite: 'strict' });
};

export const setRefreshTokenCookie = (res: Response, refreshToken?: string): void => {
    if (!refreshToken) return;

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: secureCookie,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // sevn days
    });
};
