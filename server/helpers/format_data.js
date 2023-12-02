import { genAccessToken } from "./jwt.js" 

// format data return
const retrieveData = (user) => {
    const token = genAccessToken(user);
    return {
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        access_token: token
    }
}

export default retrieveData;