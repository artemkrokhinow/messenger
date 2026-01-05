import mongoose from 'mongoose';
import Profile from '../models/ProfileModels.js'
import profileSchema from '../models/ProfileModels.js'



const ProfileService = {
    async getProfile(email){
        const chatProfile = await Profile.findOne({email: email})
        console.log('ServiceEmail',email,'ProfileDate:', chatProfile)
        return chatProfile
    }
}

export default ProfileService  