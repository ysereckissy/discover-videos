import jwt from "jsonwebtoken";
import {makeCookie, TOKEN_COOKIE_NAME} from "../../lib/cookies";

const user = async(req, res) => {
    if(req.method === 'POST') {
        try {
            if(!req.cookies.token) return res.json({ user: null});
            const token = req.cookies.token;
            const user = jwt.verify(token, process.env.JWT_SECRET);
            const { issuer, public_address, email } = user;
            /// refresh the jwt
            const newToken = jwt.sign(
                {
                    issuer,
                    "public_address": public_address,
                    email,
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * process.env.SESSION_LENGTH_IN_DAYS,
                    'https://hasura.io/jwt/claims': {
                        'x-hasura-allowed-roles': ['user'],
                        'x-hasura-default-role': 'user',
                        'x-hasura-user-id': `${issuer}`,
                    },
                },
                process.env.JWT_SECRET
            );
            /// Go get the user data from the data management layer and
            /// check that the user really exists and is active at least.

            /// update the cookie
            const cookie = makeCookie(TOKEN_COOKIE_NAME, newToken);
            res.setHeader('Set-Cookie', cookie);
            res.status(200).json({user});
        } catch (error) {
            console.error(`jwt decoding error: `, error);
            res.status(200).json({user: null});
        }
    } else {
        res.json({user: null});
    }
}

export default user;