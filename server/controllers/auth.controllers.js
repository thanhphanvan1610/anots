import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/users.models.js';
import retrieveData from '../helpers/format_data.js';
import { genAccessToken, genRefreshToken } from '../helpers/jwt.js';


class UserAuthService {

    async signUp(req, res, next) {
        try {
            const { username, password, email } = req.body;
    
            if (!username || !email || !password) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Username and password are required',
                    code: 400
                });
            }
    
            if (username.length < 5) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Username must be 5 character!',
                    code: 400
                });
            }
    
            // Validate email
            const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Invalid email format',
                    code: 400
                });
            }
    
            const existingUser = await User.findOne({ username });  //check exist username
            const existingEmail = await User.findOne({ email });  //check exist email
    
            if (existingUser || existingEmail) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Username or email already exists',
                    code: 400
                });
            }
    
            const salt = await bcrypt.genSalt(10);
            const passwordhashed = await bcrypt.hash(password, salt);
    
            const user = new User({ username, password: passwordhashed, email });
            await user.save();

            // set refresh Token

            const refresh_token = genRefreshToken(user)
            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: false,
                sameSite: "strict"
            })
    
            const data = retrieveData(user);
            return res.status(201).json({
                status: 'success',
                message: data,
                code: 201
            });
    
        } catch (error) {
            next(error);
        }
    }
    


    async signIn(req, res, next){
        try {
            const {username, password} = req.body;
            if ((!username) || !password) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Username or email and password are required',
                    code:400
                });
            }
            const user = await User.findOne({username});
            if(!user){
                return res.status(404).json({
                    status: 'failed',
                    message: 'No user found with the provided username',
                    code: 404
                });
            }
            const validPassword = await bcrypt.compare(password, user.password);
            
            if(!validPassword){
                return res.status(401).json({
                    status: 'failed',
                    message: 'Invalid password provided for the given username or email',
                    code: 401
                });
            }
            const refresh_token = genRefreshToken(user)
            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: false,
                sameSite: "strict"
            })
            const data = retrieveData(user)
            return res.status(200).json({
                status: 'success',
                message: data,
                code: 200
            });
        } catch (error) {
            next(error.message)
        }
    }

    async refreshToken(req, res, next) {
        const refresh_token = req.cookies.refresh_token;
        if(!refresh_token){
            return res.status(401).json({
                status: 'failed',
                message: 'Unauthenticated',
                code: 401
            });
        }
        try {
            const decode = jwt.verify(refresh_token, process.env.SECRET_REFRESH);
            const newAccessToken = genAccessToken(decode);
            const newRefreshToken = genRefreshToken(decode);
            res.cookie('refresh_token', newRefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict"
            });
            return res.status(200).json({
                status: 'success',
                message: {
                    access_token: newAccessToken
                },
                code: 200
            });
        } catch (error) {
            next(error.message)
        }
    }
    
    
}

export default UserAuthService;
