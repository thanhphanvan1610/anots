import jwt from 'jsonwebtoken';
import 'dotenv/config';
import client from '../database/redis.js';

const genAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role, isban: user.isban },
        process.env.SECRET_ACCESS,
        { expiresIn: '1h' })

}
const genRefreshToken = (user) => {
    const refresh_token = jwt.sign(
        { id: user.id, username: user.username, role: user.role,isban: user.isban },
        process.env.SECRET_REFRESH,
        { expiresIn: '30d' })

        client.set(user.username.toString(), JSON.stringify({refresh_token: refresh_token}), (err) => {
            if (err) {
                console.error('Server Internal Error');
            }
        });

    return refresh_token;
}
const getAsync = (key) => {
    return new Promise((resolve, reject) => {
        client.get(key, (err, data) => {
            if (err) {
                reject(err);
            } else if (data === null) {
                reject(new Error(`No value found for key: ${key}`));
            } else {
                resolve(data);
            }
        });
    });
}




export {
    genAccessToken,
    genRefreshToken,
    getAsync
}