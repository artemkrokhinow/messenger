import mongoose from "mongoose";
const profileSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId ,ref: 'User', required: true},
    email: {type: String, required: true},
    avatar: {type: String,  default : ''},
    description: {type: String, default : ''},
    birthday: {type: Date},
    lastSeen: {type: Date, default: Date.now}
}, 
{timestamps: true })

export default mongoose.model('Profile', profileSchema)  