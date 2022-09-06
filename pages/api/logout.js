import jwt from "jsonwebtoken";
import {generateClearedCookie, TOKEN_COOKIE_NAME} from "../../lib/cookies";
import {magicAdmin} from "../../lib/magic";

const logout = async (req, res) => {
    try {
        if(!req.cookies.token) return res.status(401).json({message: `User is not logged in`});
        const token = req.cookies.token;
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const clearedCookie = generateClearedCookie(TOKEN_COOKIE_NAME);
        try {
            await magicAdmin.users.logoutByIssuer(user.issuer);
        } catch (error) {
            console.error(`api/logout error: Magic session expired => ${error}`);
        }
        res.setHeader('Set-Cookie', clearedCookie);
        res.status(302).send();
    } catch (error) {
        console.error(`api/logout error`, error);
        res.status(401).json({message: `User is not logged in`});
    }
};
export default logout;