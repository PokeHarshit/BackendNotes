import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: String
    }
}, { timestamps: true })

export const User = mongoose.model('User', userSchema)