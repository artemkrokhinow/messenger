import { socket } from '../services/socket.js';
import { useQueryClient } from '@tanstack/react-query';
import {useEffect} from 'react'
import {useProfile} from '../hooks/useProfile.js'

export function useSocketEvent() {
    const queryClient = useQueryClient()
useEffect(()=>{
    const handleMessage = (data) =>{
        queryClient.setQueryData(['users'], user => {
        
        const userFind = (user.find(u => 
                                u._id === data.senderId
                                ))
        if(!userFind) return user
        const userFilter = user.filter(u => 
                                u._id !== data.senderId
                                 )
            return [userFind ,...userFilter]
        });
        queryClient.setQueriesData({queryKey: ['messages']}, (messages) => {
            if (!messages) return [];
            return [...messages, data];
        });
        queryClient.setQueriesData({queryKey: ['lastMessages']}, (messages) => {
            if (!messages) return [];
            const lastMessage = (messages.find(message => 
                                (message.senderId === data.senderId &&  message.receiverId === data.receiverId) || 
                                (message.receiverId === data.senderId &&  message.senderId === data.receiverId)
                                ))
                    if(lastMessage){
        
                        return messages.map(message => 
                                (message.senderId === data.senderId &&  message.receiverId === data.receiverId) || 
                                (message.receiverId === data.senderId &&  message.senderId === data.receiverId)
                                ? data 
                                : message)
                        
                    }else { 
                    return [...messages, data]
                    }});
    }
    const handleOnlineUsers = (data) =>{
        queryClient.setQueryData(['onlineUsers'], data)  
    };
    const handleUpdateAvatar = (data) =>{
            queryClient.setQueryData(['profile', String(data.user)], (oldProfile) => {
                if (!oldProfile) return undefined;
                if (String(oldProfile.user) !== String(data.user)) return oldProfile
                return { ...oldProfile, avatar: data.avatar };
            });
            queryClient.setQueriesData({queryKey: ['users']}, (oldUser) => {
                if (!oldUser) return undefined;
                return oldUser.map(u => {if (String(u._id) !== String(data.user)) return u  
                return { ...u, avatar: data.avatar };
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
    const handleEditMessage = (data) =>{
        queryClient.setQueryData(['messages', data.senderId], (oldMessages) => {
            if (!oldMessages) return [];
            return oldMessages.map(msg => String(msg._id) === String(data._id) ? {...msg, text: data.text} : msg);
        });
        queryClient.setQueriesData({queryKey: ['lastMessages']}, (messages) => {
            if (!messages) return [];
            return messages.map(message => String(message._id) === String(data._id) ? {...message, text: data.text} : message);
        });
    }
    socket.on('editMessage', handleEditMessage)
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
        socket.off('editMessage', handleEditMessage)
    }
},[queryClient])
    }