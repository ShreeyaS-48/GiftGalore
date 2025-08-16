import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const handleLogin = async (req, res) => {
    const {name, password} = req.body;
    if(!name || !password) return res.status(400).json({'message' : 'Username and password are required'})
    const foundUser = await User.findOne({name}).exec()
    if(!foundUser) return res.sendStatus(401) // unauthorised
    //evaluate password
    const match = await bcrypt.compare(password, foundUser.password)
    if(match) {
        const roles = Object.values(foundUser.roles)
        const accessToken = jwt.sign(
            {"UserInfo": {
                "user" : foundUser.name,
                "roles" : roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '1000s'}
        )
        const refreshToken = jwt.sign(
            {"user" : foundUser.name},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        )
        //saving refreshtoken with current user -> allows to invalidate after current user logs out
        foundUser.refreshToken = refreshToken
        const result = await foundUser.save()
        console.log(result)

        res.cookie('jwt', refreshToken, {httpOnly: true, secure: true,sameSite: 'None',maxAge: 24*60*60*1000})//, secure: true samesit = Lax
        res.json({user: foundUser.name, roles,accessToken})
    } else {
        res.sendStatus(401)
    }
}

export default handleLogin;