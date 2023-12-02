import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    avatar: {
        type: String,
        default: function () {
            return `https://ui-avatars.com/api/?name=${this.username.toUpperCase()}`;
        }
    },
    apitoken: {
        type: String
    }
})

const User = mongoose.model('users', userSchema)
export default User