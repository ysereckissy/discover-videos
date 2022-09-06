import {serialize} from 'cookie';

export const TOKEN_COOKIE_NAME = 'token';
const MAX_AGE = 60 * 60 * 24 * process.env.SESSION_LENGTH_IN_DAYS;

export const makeCookie = (cookieName, token) => {
    return serialize(cookieName, token, {
        maxAge: MAX_AGE,
        expires: new Date(Date.now() + MAX_AGE * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // if true, cookie will only be set if https (won't be set if http)
        path: '/',
        sameSite: 'lax',
    });
};

export const generateClearedCookie = (cookieName) => {
    return serialize(cookieName, '', {
        maxAge: -1,
        path: '/',
    });
};