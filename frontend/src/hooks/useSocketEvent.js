import { socket } from '../services/socket.js';
import { useQueryClient } from '@tanstack/react-query';
import {useEffect} from 'react'

export function useSocketEvent() {
    const queryClient = useQueryClient()
useEffect(()=>{
    const handleMessage = (data) =>{
        queryClient.invalidateQueries({queryKey: ['messages', data.senderId]});
    }
    const handleOnlineUsers = (data) =>{
        queryClient.invalidateQueries({queryKey: ['onlineUsers', data]});
    }
    socket.on('onlineUsers', handleOnlineUsers)
    socket.on('getMessage', handleMessage)
    return () => {
        socket.off('getMessage', handleMessage)
        socket.off('onlineUsers', handleOnlineUsers)
    }

},[])
    }