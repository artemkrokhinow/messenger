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
            queryClient.setQueriesData({queryKey: ['profile']}, (oldProfile) => {
                if (!oldProfile) return undefined;
                if(String(oldProfile._id) !== String(data.user)) return oldProfile
                return { ...oldProfile, avatar: data.avatar };
            });
            queryClient.setQueriesData({queryKey: ['users']}, (oldUser) => {
                      if (!oldUser) return undefined;
                      return oldUser.map(user => {
                          if (String(user._id) === String(data.user)) {
                              return { ...user, avatar: data.avatar };
                          } 
                           return user  
                      })            
            })
    }
    const handleReadMessage = (data) =>{
        queryClient.setQueryData(['messages', data.receiverId], (oldMessages) =>{
            if (!oldMessages) return [];
            return oldMessages.map(msg => {
                if (String(msg._id) === String(data._id)) {
                    return { ...msg, read: true };
                }
                return msg;
            })
        });
    }
    const handleDeleteMessage = (data) =>{
        queryClient.setQueryData(['messages', data.senderId], (oldMessages) => {
            if (!oldMessages) return [];
            return oldMessages.filter(msg => String(msg._id) !== String(data._id));
        });
    }
    socket.on('deleteMessage', handleDeleteMessage)
    socket.on('onlineUsers', handleOnlineUsers)
    socket.on('getMessage', handleMessage)
    socket.on('updateAvatar', handleUpdateAvatar)
    socket.on('readMessage', handleReadMessage)
    return () => {
        socket.off('getMessage', handleMessage)
        socket.off('onlineUsers', handleOnlineUsers)
        socket.off('updateAvatar', handleUpdateAvatar)
        socket.off('readMessage', handleReadMessage)
        socket.off('deleteMessage', handleDeleteMessage)
    }
},[queryClient])
    }