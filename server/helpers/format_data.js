import { genAccessToken} from "./jwt.js" 


const retrieveData = (user) => {
    
    const accessToken = genAccessToken(user);
    
    return {
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        access_token: accessToken
    }
}

export default retrieveData;