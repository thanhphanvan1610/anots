import jwt from 'jsonwebtoken';
import 'dotenv/config'

const genAccessToken = (user) => {
    return jwt.sign(
        {id: user._id, username: user.username, role: user.role},
         process.env.SECRET_ACCESS,
         {expiresIn: '1h'})
    
}
const genRefreshToken = (user) => {
    return jwt.sign(
        {id: user._id, username: user.username},
         process.env.SECRET_REFRESH,
         {expiresIn: '30d'})
    
}
export {
    genAccessToken,
    genRefreshToken
}