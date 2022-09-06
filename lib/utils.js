import jwt from "jsonwebtoken";

export const verifyToken = async (req) => {
    const token = req.cookies.token || 'invalid-token';
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const { issuer, public_address, email } = user;
        /// refresh the jwt
        const newToken = jwt.sign(
            {
                issuer,
                public_address,
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
        return {
            user_id: issuer,
            public_address,
            email,
            token: newToken
        };
    } catch (error) {
        console.error(`An Error occurred when validating the token: `, error)
    }
}