import 'dotenv/config';
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import routerMessage from "./Message/routerMessage.js"
import rrouter  from "./auth/routerRegistr.js"
import { Server } from 'socket.io'
import {createServer} from 'http'
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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api', rrouter)
app.use('/api', routerMessage)
app.use('/api', routerProfile)
app.use((req, res) => {
    res.status(404).json({message: "route not found"})
})
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({message: "Internal Server Error"})
})

const onlineUsers = new Map();
io.on('connection', (socket) => {
    socket.on('addUser', (userId) => {
        socket.userId = userId;
        console.log(`User connected: ${userId}`);
        onlineUsers.set(userId, socket.id)
        io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    });

    socket.on('sendMessage', async (data) => {
        io.to(onlineUsers.get(data.receiverId)).emit('getMessage', data);
    });

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