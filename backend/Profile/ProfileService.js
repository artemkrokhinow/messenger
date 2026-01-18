import mongoose from 'mongoose';
import Profile from '../models/ProfileModels.js'
import getContacts from '../auth/RegistrController.js'
import User from '../models/userModels.js'
import * as sharp from 'sharp';

const ProfileService = {
    async getProfile(email){
        const chatProfile = await Profile.findOne({email: email})
        if(!chatProfile){
            const user = await User.findOne({email: email})
            if(!user){
                return null
            }
            const newProfile = new Profile({
                user: user._id,
                name: user.name,
                email: user.email,
                avatar: '',
                description: 'Hello!',
                birthday: null,
                lastSeen: Date.now()
            })
            await newProfile.save()
            return newProfile
        }
        console.log('ServiceEmail',email,'ProfileDate:', chatProfile)
        return chatProfile
    },
    async uploadAvatar(userEmail, avatar ) {
        const profile = await Profile.findOne({ email: userEmail });
        if (!profile) {
            throw new Error('Profile not found');
        }
        const updatedAvatar = await Profile.findOneAndUpdate(
            { email: userEmail },
            { avatar: avatar },
            { new: true }
        )
        return await updatedAvatar.save();

}       

}
export default ProfileService  