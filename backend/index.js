import 'dotenv/config';
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import routerMessage from "./Message/routerMessage.js"
import rrouter  from "./auth/routerRegistr.js"
import { Server } from 'socket.io'
import {createServer} from 'http'
import routerProfile from './Profile/ProfileRouter.js'
const allowedOrigins = ["https://mymessenger-4jqz.onrender.com", "http://localhost:3000"];
const PORT = process.env.PORT || 5000
const DB_URL = process.env.DB_URL
const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {origin:allowedOrigins,}
})
const onlineUsers = new Map();
app.use(cors({origin: allowedOrigins,}
))
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api', rrouter)
app.use('/api', routerMessage)
app.use('/api', routerProfile)
app.get('/api/online-users', (req, res) => {
    try{
    console.log('Fetching online users:', Array.from(onlineUsers.keys()));
    res.json(Array.from(onlineUsers.keys()).map(id => String(id)));
}catch (error){
    console.error('Error fetching online users:', error);
    res.status(500).json({message: "Error fetching online users", error: error.message, stack: error.stack });
}});
app.use((req, res) => {
    res.status(404).json({message: "route not found"})
})
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({message: "Internal Server Error"})
})


io.on('connection', (socket) => {
    socket.on('addUser', (userId) => {
        const stringUserId = String(userId);
        socket.userId = stringUserId;
        console.log(`User connected: ${stringUserId}`);
        onlineUsers.set(stringUserId, socket.id)
        io.to(onlineUsers).emit('onlineUsers', Array.from(onlineUsers.keys()));
        console.log('Current online users:', Array.from(onlineUsers.keys()));
    });

    socket.on('sendMessage', async (data) => {
        io.to(onlineUsers.get(data.receiverId)).emit('getMessage', data);
        io.to(onlineUsers.get(data.senderId)).emit('lastMessages', data);
    });
    socket.on('updateAvatar', async (data) => {
        socket.broadcast.emit('updateAvatar', data);
    });
    socket.on('readMessage', async (data) => {
        io.to(onlineUsers.get(data.senderId)).emit('readMessage', data);
    })
    socket.on('deleteMessage', async (data) => {
        io.to(onlineUsers.get(data.receiverId)).emit('deleteMessage', data);
    })

socket.on('disconnect', () => {
    onlineUsers.delete(socket.userId);
    console.log('User disconnected');
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));
  });
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