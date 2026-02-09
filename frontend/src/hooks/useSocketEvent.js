import { socket } from '../services/socket.js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {useEffect} from 'react'

export function useSocketEvent(currentUserId, selectedUserId) {
    const queryClient = useQueryClient()
    
    useEffect(()=>{
        const partnerId = ((message)=>{
return(message.senderId === currentUserId ? message.receiverId : message.senderId)
        })
    socket.on('getMessage', (message) => {
        queryClient.invalidateQueries({queryKey: ['messages', partnerId(message)]});
    })
    socket.on('deleteMessage', (message) => {
        queryClient.invalidateQueries({queryKey: ['messages', message]});
    })
    return(()=>{
    socket.off('getMessage', )
    socket.off('deleteMessage')})
    
    },[])
}