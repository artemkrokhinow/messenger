import 'dotenv/config';
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import routerMessage from "./Message/routerMessage.js"
import rrouter  from "./auth/routerRegistr.js"
import { Server } from 'socket.io'
import {createServer} from 'http'
import MessageController from './Message/MessageController.js'
import routerProfile from './Profile/ProfileRouter.js'

const PORT = process.env.PORT || 5000
const DB_URL = process.env.DB_URL
const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {origin:["https://mymessenger-4jqz.onrender.com", 
                     "http://localhost:3000" 
    ]}
})

app.use(cors())
app.use(express.json())
app.use('/api', rrouter)
app.use('/api', routerMessage)
app.use('/api', routerProfile)

let onlineUsers = new Map()
io.on('connection', (socket)=>{
   
    socket.on('addUser', (userId)=>{
        let userSockets = onlineUsers.get(userId) || [];
        if(!userSockets.includes(socket.id)){
            userSockets.push(socket.id)
        }
         userSockets.push(socket.id)
       onlineUsers.set(userId, userSockets)
        console.log(`+ User ${userId} added. Online users now:`, onlineUsers);
    })
    socket.on('sendMessage',async ({senderId, receiverId, text}) =>{
        const receiverSocketId = onlineUsers.get(receiverId)
        if(receiverSocketId && receiverSocketId.length > 0 ){
            const newMessage = await MessageController.create(senderId, receiverId , text)
       receiverSocketId.forEach(socketId =>{
        io.to(socketId).emit('getMessage', newMessage)
       })
        }
    })
    console.log('io connect ')
    socket.on('disconnect', ()=>{
        let disconnectedUserId;
        for (const [userId, sockets] of onlineUsers.entries()) {
           
            if (sockets.includes(socket.id)){
            disconnectedUserId = userId
            break;}
            } if (disconnectedUserId){
                const remainingSockets = onlineUsers.get(disconnectedUserId).filter(s => s !== socket.id)
                if(remainingSockets.length > 0){
                    onlineUsers.set(disconnectedUserId, remainingSockets)
                } else onlineUsers.delete(disconnectedUserId)
            
                
            }
           
    })
})

async function startApp() {
    try {
        await mongoose.connect(DB_URL)
        server.listen(PORT, ()=> console.log('SERVER STARTED ON PORT ' + PORT ))
    } catch (e){
        console.log(e)
    }
}
startApp()