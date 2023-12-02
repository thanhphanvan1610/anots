import bcrypt from 'bcrypt';
import User from '../models/users.models.js';
import retrieveData from '../helpers/format_data.js';


class UserAuthService {

    async signUp(req, res, next) {
        try {
            const { username, password, email } = req.body;
    
            if (!username || !password) {
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
            if (email && !emailRegex.test(email)) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Invalid email format',
                    code: 400
                });
            }
    
            const existingUser = await User.findOne({ username });  //check exist username
            const existingEmail = email ? await User.findOne({ email }) : null;  //check exist email
    
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
            const {username, password, email} = req.body;
            if (!username || !password) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Username and password are required',
                    code:400
                });
            }
            const user = await User.findOne({username: username, email: email});
            if(!user){
                return res.status(404).json({
                    status: 'failed',
                    message: 'Username not exist!',
                    code: 404
                });
            }
            const validPassword = await bcrypt.compare(password, user.password);
            if(!validPassword){
                return res.status(301).json({
                    status: 'failed',
                    message: 'Username or password is wrong!',
                    code: 301
                });
            }
            const data = retrieveData(user)
            return res.status(200).json({
                status: 'success',
                message: data,
                code: 200
            });
            
            
        } catch (error) {
            next(error)
        }

    }
}

export default UserAuthService;
