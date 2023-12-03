import User from '../models/users.models.js';
import bcrypt from 'bcrypt'
const getUsers = async(req, res, next) => {
    try {
        const users = await User.find({});
        
        return res.status(200).json({
            status: 'success',
            message: users,
            code: 200
        });
    } catch (error) {
        next(error)
    }
}

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { username, password, email, role, avatar, isban } = req.body;
    
        if (!username || !password) {
            return res.status(400).json({
                status: 'failed',
                message: 'Username and password are required',
                code: 400
            });
        }

        // Get the current user
        const currentUser = await User.findById(id);

        // Check if a user with the new username already exists
        if (username !== currentUser.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Username already taken',
                    code: 400
                });
            }
        }

        // Check if a user with the new email already exists
        if (email && email !== currentUser.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Email already taken',
                    code: 400
                });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const passwordhashed = await bcrypt.hash(password, salt);
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, password: passwordhashed, email, role, avatar, isban },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(400).json({
                status: 'failed',
                message: 'Not Found User',
                code: 400
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'User updated successful!',
            code: 200
        });
    } catch (error) {
        
        next(error);
    }
};

const getUserById = async(req, res, next) => {
    const {id} = req.params;
    if (!id) {
        return res.status(400).json({
            status: 'failed',
            message: 'User ID is required',
            code: 400
        });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                message: 'User not found',
                code: 404
            });
        }

        return res.status(200).json({
            status: 'success',
            message: user,
            code: 200
        });
        
    } catch (error) {
        next(error);
    }
}

const deleteUser = async(req, res, next) => {
    const {id} = req.params;
    if (!id) {
        return res.status(400).json({
            status: 'failed',
            message: 'User ID is required',
            code: 400
        });
    }

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                message: 'User not found',
                code: 404
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Successfully deleted the user',
            code: 200
        });
        
    } catch (error) {
        next(error);
    }
}

const banUser = async(req, res, next) => {
    try {
        const id = req.query.user
        if(!id){
            return res.status(404).json({
                status: 'failed',
                message: 'required id user',
                code: 400
            });
        }
        const banUser = await User.findByIdAndUpdate(id, {isban: true}, {new: true});
        if(!banUser){
            return res.status(404).json({
                status: 'failed',
                message: 'User not found',
                code: 404
            });
        }
        return res.status(200).json({
            status: 'success',
            message: 'Successfully banned the user',
            code: 200
        });
    } catch (error) {
        console.log(error.message);
        next(error)
    }
}


const unBanUser = async(req, res, next) => {
    try {
        const id = req.query.user
        if(!id){
            return res.status(404).json({
                status: 'failed',
                message: 'required id user',
                code: 400
            });
        }
        const banUser = await User.findByIdAndUpdate(id, {isban: false}, {new: true});
        if(!banUser){
            return res.status(404).json({
                status: 'failed',
                message: 'User not found',
                code: 404
            });
        }
        return res.status(200).json({
            status: 'success',
            message: 'Successfully unbanned the user',
            code: 200
        });
    } catch (error) {
        console.log(error.message);
        next(error)
    }
}



export {
    getUsers,
    updateUser,
    getUserById,
    deleteUser,
    banUser,
    unBanUser
}