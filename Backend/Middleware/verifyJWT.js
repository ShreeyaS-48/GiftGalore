import jwt  from 'jsonwebtoken';


const verifyJWT = (req, res, next) =>{
    const authHeader = req.headers.authorization || req.headers.Authorization
    if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token, 
        process.env.ACCESS_TOKEN_SECRET, //verify with middleware
        (err, decoded) => { //decoded info from jwt
            if(err) return res.sendStatus(401) // invalid token (forbidden -> token tampered)
            req.user = decoded.UserInfo.user
            console.log(req.user)
            req.roles = decoded.UserInfo.roles
            next()
        }
    )
}

export default verifyJWT;