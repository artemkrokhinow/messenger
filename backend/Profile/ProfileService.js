import mongoose from 'mongoose';
import Profile from '../models/ProfileModels.js'



const ProfileService = {
    async getConversation(user){
        const chatProfile = await Profile.find({user})
        console.log('ServiceUser',user,'ProfileDate:', chatProfile)
        return chatProfile
    }
}

export default ProfileService  