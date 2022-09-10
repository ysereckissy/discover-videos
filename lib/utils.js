import * as jose from 'jose';
import {getUserById} from "./db/hasura";

export const verifyToken = async (token) => {
    try {
        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload: {issuer, public_address, email }} = await jose.jwtVerify(token, secretKey);
        /// refresh the jwt
        const newToken = await new jose.SignJWT({
            issuer,
            public_address,
            email,
            'https://hasura.io/jwt/claims': {
                'x-hasura-allowed-roles': ['user'],
                'x-hasura-default-role': 'user',
                'x-hasura-user-id': `${issuer}`,
            },
        }).setProtectedHeader({ alg: 'HS256', })
            .setIssuedAt( )
            .setIssuer(issuer)
            .setExpirationTime(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * process.env.SESSION_LENGTH_IN_DAYS)
            .sign(secretKey);
        /// go get user info from the data management layer and check.
        const user = await getUserById(issuer, newToken);
        if(!user || user.issuer !== issuer) {
            return null;
        }
        return {
            user_id: issuer,
            public_address,
            email,
            token: newToken,
        };
    } catch (error) {
        console.error(`An Error occurred when validating the token: `, error)
    }
}