import ProfileService from '../Profile/ProfileService.js'
import User from '../models/userModels.js'
import bcrypt from "bcryptjs";  
import jwt from "jsonwebtoken";  
import {secret} from "../config.js"
import Profile from '../models/ProfileModels.js'
import messageService from '../Message/MessageService.js'
import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const generateAccessToken = (id, email) =>{
    const payload = {
        id, 
        email
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

const RegistrController = {
    async registration(req ,res) {
        try {
            const {email, password, name} = req.body
            const NullUser = await User.findOne({email})
            if (NullUser){
                return res.status(400).json ({message: 'user is already registrated'  })
            } 
            const hashPassword = await bcrypt.hash(password, 5)
            const user = new User({email, password:  hashPassword, name})
            console.log('USER DATA', user)
            await user.save()
            await ProfileService.getProfile(user._id)
            return res.json({message: `пользователь ${user.email}`})
        }catch(e){
            console.log(e)
            res.status(400).json({message: 'registration error', error: e.message, stack: e.stack })
        }
        
    },
    async login(req, res){
        try {
             const {email , password} = req.body
             const user = await User.findOne({$or: [{email: email}, {name: email}]})
            if (!user){
                return res.status(400).json ({message: 'not registrated '  })
            }  
            const CheckPassword = bcrypt.compareSync(password, user.password)
            if (!CheckPassword){
                 return res.status(400).json ({message: 'not registrated '  })
            } const token = generateAccessToken(user._id, user.email)
            return res.json({token})
        }catch(e){
            res.status(400).json({message: 'ControllerLogin error' })
        }
      
    },
    async googleLogin(req, res) {
        try {
            const { credential } = req.body;
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            const { email, name, picture } = payload;
            
            let user = await User.findOne({ email });
            
            if (!user) {
                // Create new user without password
                user = new User({ email, name });
                await user.save();
                
                // Create profile with Google picture
                const newProfile = new Profile({
                    user: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: picture,
                    description: 'Hello, world!',
                    birthday: null,
                    lastSeen: Date.now()
                });
                await newProfile.save();
            }
            
            const token = generateAccessToken(user._id, user.email);
            return res.json({ token });
        } catch (e) {
            console.error('Google Login Error:', e);
            res.status(400).json({ message: 'Google login failed', error: e.message });
        }
    },
    async getContacts(req,res){
        try{
            const data = await Profile.find({}).select('email name avatar user') 
            const users = data.map(p=>({
                    _id: p.user,
                    name: p.name,
                    email: p.email,
                    avatar: p.avatar
            }))
            res.json(users)
            
        }catch(e) {
            console.log(e)
            res.status(500).json({message : 'Error receiving contacts'})
        }
    }
}
export default RegistrController