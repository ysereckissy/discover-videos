// eslint-disable-next-line @next/next/no-server-import-in-page
import {NextRequest, NextResponse} from "next/server";
import {verifyToken} from "./lib/utils";
import {makeCookie, TOKEN_COOKIE_NAME} from "./lib/cookies";

const passRequestThrough = pathname => {
    return pathname.startsWith('/_next') || pathname.startsWith('/login') || pathname.startsWith('/api/login');
}

export const middleware = async (req) => {
    const { pathname } = req.nextUrl;
    if(passRequestThrough(pathname)) {
        return NextResponse.next();
    }
    const token = req.cookies.get('token');
    if(!token) {
        req.nextUrl.pathname = '/login';
        return NextResponse.redirect(req.nextUrl);
    }
    /// validate the token and extract the user information.
    /// redirect to login if any problem.
    const user = await verifyToken(token);
    if(user?.user_id) {
        return NextResponse.next();
    }
    req.nextUrl.pathname = '/login';
    return NextResponse.redirect(req.nextUrl);
}