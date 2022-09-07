import { magicAdmin } from "../../lib/magic";
import { userExist, createUser } from "../../lib/db/hasura";
import { makeCookie, TOKEN_COOKIE_NAME } from "../../lib/cookies";
import * as jose from 'jose';
import { createSecretKey } from 'crypto';

const login = async (req, res) => {
    if(req.method === "POST") {
        try {
            const auth = req.headers?.authorization;
            const didToken = auth ? auth.substring(7) : "bad-token";
            /// Validate Magic's DID Token
            magicAdmin.token.validate(didToken);
            /// Only then, can the token be deciphered!!
            const metadata = await magicAdmin.users.getMetadataByToken(didToken);
            const { issuer, email, publicAddress } = metadata;
            const userInfo = {
                issuer,
                email,
                "public_address": publicAddress,
            };
            /// refresh the jwt
            const secret = createSecretKey(process.env.JWT_SECRET, 'utf-8');
            const token = await new jose.SignJWT({
                ...userInfo,
                'https://hasura.io/jwt/claims': {
                    'x-hasura-allowed-roles': ['user'],
                    'x-hasura-default-role': 'user',
                    'x-hasura-user-id': `${issuer}`,
                },
            }).setProtectedHeader({ alg: 'HS256', })
                .setIssuedAt( )
                .setIssuer(issuer)
                .setExpirationTime(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * process.env.SESSION_LENGTH_IN_DAYS)
                .sign(secret);

            const existingUser = await userExist(issuer, token);
            (!existingUser) && await createUser(userInfo, token);
            const tokenCookie = makeCookie(TOKEN_COOKIE_NAME, token);
            res.setHeader('Set-Cookie', tokenCookie);
            res.status(200).send({ success: true });
        } catch (error) {
            console.error("something went wrong logging in", error);
            res.status(500).send({ success: false });
        }
    } else {
        res.send({ success: false })
    }
};
export default login;