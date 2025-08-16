import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const handleRefreshToken = async (req, res) =>{
    const cookies = req.cookies;
    console.log("Cookies:", cookies);
    // optional chaining if cookies check for jwt property
    if(!cookies?.jwt) return res.sendStatus(401);// unauthorised
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({refreshToken}).exec();
    if(!foundUser) return res.sendStatus(403) // forbidden
    jwt.verify(
        refreshToken, 
        process.env.REFRESH_TOKEN_SECRET, 
        (err, decoded) =>{
            if(err || foundUser.name !== decoded.UserInfo?.user) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
            {"UserInfo" : {
                "user" : foundUser.name, 
                "roles": roles} 
            },
            process.env.ACCESS_TOKEN_SECRET, 
            {expiresIn: '1000s'}
            );
            console.log("refreshToken inside")
            res.json({user: foundUser.name, roles,accessToken})
        }
    )
    
}

export default handleRefreshToken;