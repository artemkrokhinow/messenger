import mongoose from "mongoose";
const Post = new mongoose.Schema({
    email: {type: mongoose.Schema.Types.email ,ref: 'User', required: true},
    title: {type: String, required: true},
    content: {type: String, required: true},
})

export default Post