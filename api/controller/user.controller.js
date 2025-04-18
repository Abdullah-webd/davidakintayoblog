import { errorHandler } from "../utils/error.js";
import User from "../model/user.model.js";
import bcrypt from 'bcryptjs';  
export const test = (req, res) => {
    res.json('User route is working fine');
}

export const updateUser = async (req, res,next) => {
    if (req.user.id !== req.params.userId){
        return next(errorHandler(403,'You are not authorized to update this user'));
    }
    if (req.body.password) {
        if(req.body.password?.length < 6){
            return next(errorHandler(400,'Password should be at least 6 characters long'));

        }
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    if(req.body.username?.length < 7 || req.body.username?.length > 20){
        return next(errorHandler(400,'Username should be between 7 and 20 characters long'));
    }
    if (req.body.username?.includes(' ')) {
        return next(errorHandler(400, 'Username should not contain spaces'));
      }
      
    if(req.body.username !== req.body.username?.toLowerCase()){
        return next(errorHandler(400,'Username should be in lowercase'));
    }
    if(req.body.username?.match(/^[a-zA-Z0-9]+$/) === null){
        return next(errorHandler(400,'Username should not contain special characters'));
    }

    try {
const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
        $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            profilePicture: req.body.profilePicture,
        }
    }, {new: true});
        const {password:pass, ...rest} = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
        
    }
}


export const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.userId){
        return next(errorHandler(403,'You are not authorized to delete this user'));
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User deleted successfully');
    } catch (error) {
        next(error);
        
    }
}

export const signOut = async (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json('User signed out successfully');
    } catch (error) {
        next(error);
        
    }
}

export const getUsers = async (req, res, next) => {
    if(!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not authorized to get users'));
    }
    try {
        const users = await User.find()
        const usersWithoutPassword = users.map(user => {
            const { password, ...rest } = user._doc;
            return rest;
        });
        res.status(200).json(usersWithoutPassword);
    } catch (error) {
        next(error);
        
    }
}

export const deleteUserByAdmin = async (req, res, next) => {
    if(!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not authorized to delete this user'));
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User deleted successfully');
    } catch (error) {
        next(error);
        
    }
}
