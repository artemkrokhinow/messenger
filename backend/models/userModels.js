import mongoose from "mongoose";

const User = new mongoose.Schema({
    email: {type: String, unique: true, required: true },
    name: {type: String, required: true },
    password: {type: String , required: false },
},
{timestamps: true })

export default mongoose.model('User', User)