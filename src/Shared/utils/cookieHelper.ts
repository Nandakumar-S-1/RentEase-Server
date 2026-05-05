import { Response } from 'express';

const REFRESH_COOKIE_NAME = 'refreshToken';

//here in default node env is undefined. so sec cookie will be false here
const secureCookie = process.env.NODE_ENV === 'production';

export const clearRefreshTokenCookie = (res: Response): void => {
    const base = {
        httpOnly: true, //for xss attack rpevention
        secure: secureCookie, //http in dev, s only in prod
        path: '/', //applicable for entier app
    } as const;

    res.clearCookie(REFRESH_COOKIE_NAME, { ...base, sameSite: 'lax' });
};


//same site is the one which controls the browser is allowed to send user cooke wiht requst
//cokie is stored when user login, when user visit malicious website and isrt send a req to users backedn, browser will automatically icnldude the users cookie
//csrf. so to prevent this same site only sends the cookie in safe situatuois.
// 'none' cookie willsent everywhere to other sites also.
//lax = sent for same site req. and also when user clicks a link in my site. but not to orher sites.
//strict = only snets it if req is from same site


export const setRefreshTokenCookie = (res: Response, refreshToken?: string): void => {
    if (!refreshToken) return;

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: secureCookie,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
