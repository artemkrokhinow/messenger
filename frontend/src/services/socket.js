import { io } from 'socket.io-client';

const SOCKET_URL = 'https://messenger-backend-g6ck.onrender.com/api'; 


export const socket = io(SOCKET_URL, {
    autoConnect: false })