import { makeCookie, TOKEN_COOKIE_NAME } from "../../lib/cookies";
import { verifyToken } from "../../lib/utils";

const user = async(req, res) => {
    if(req.method === 'POST') {
        try {
            if(!req.cookies.token) return res.json({ user: null});
            const { user_id, email, token } = await verifyToken(req.cookies.token);
            /// update the cookie
            const cookie = makeCookie(TOKEN_COOKIE_NAME, token);
            res.setHeader('Set-Cookie', cookie);
            res.status(200).json({user: { user_id, email }});
        } catch (error) {
            console.error(`jwt decoding error: `, error);
            res.status(200).json({user: null});
        }
    } else {
        res.json({user: null});
    }
}

export default user;