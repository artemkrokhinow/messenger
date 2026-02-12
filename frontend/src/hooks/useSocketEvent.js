import { socket } from '../services/socket.js';
import { useQueryClient } from '@tanstack/react-query';
import {useEffect} from 'react'
import {useProfile} from '../hooks/useProfile.js'

export function useSocketEvent() {
    const queryClient = useQueryClient()
useEffect(()=>{
    const handleMessage = (data) =>{
        queryClient.invalidateQueries({queryKey: ['messages', data.senderId]});
    }
    const handleOnlineUsers = (data) =>{
        queryClient.invalidateQueries({queryKey: ['onlineUsers', data]});
    }
    const handleUpdateAvatar = (data) =>{
        queryClient.invalidateQueries({queryKey: ['users', data.user]});
    }
    socket.on('onlineUsers', handleOnlineUsers)
    socket.on('getMessage', handleMessage)
    socket.on('updateAvatar', handleUpdateAvatar)
    return () => {
        socket.off('getMessage', handleMessage)
        socket.off('onlineUsers', handleOnlineUsers)
        socket.off('updateAvatar', handleUpdateAvatar)
    }
},[queryClient])
    }