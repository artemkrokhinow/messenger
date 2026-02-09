import { useState, useEffect, useRef } from 'react';
import api from '../services/api.js';
import { socket } from '../services/socket.js';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
export function useChat(token, selectedUser, currentUserId){
    const queryClient = useQueryClient()
 
    const {data: messages = []} = useQuery({
        queryKey: ['messages', selectedUser?._id],
        queryFn: () => api.getConversation(selectedUser?._id) ,
        enabled: !!selectedUser,
        staleTime: Infinity,
      });
      const {mutateAsync: deleteMessage} = useMutation({
        mutationFn: async(messageId)=>{
           return( api.deleteMessage(messageId))
        }, 
        mutationKey: ['deleteMessage', selectedUser?._id],
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ['messages', selectedUser?._id]});
        }
      })
      const {mutateAsync: sendMessage} = useMutation({
        mutationFn: async (text)=>{
           return( api.sendMessage({ senderId: currentUserId, receiverId: selectedUser._id, text :text}))
        },
        mutationKey: ['sendMessage', selectedUser?._id],
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ['messages', selectedUser?._id]}); 
        }});
        return{messages, sendMessage, deleteMessage}
}
