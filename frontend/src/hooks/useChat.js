import api from '../services/api.js';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { socket } from '../services/socket.js';
export function useChat(selectedUser, currentUser){
    const queryClient = useQueryClient()
    const chatId = selectedUser?._id || selectedUser;
    const {mutateAsync: sendMessageMutation, } = useMutation({
        mutationFn: async (messageData)=>{
            return( api.sendMessage(messageData))
        },
        onSuccess: (data)=>{
            socket.emit('sendMessage', data);
            queryClient.invalidateQueries({queryKey: ['messages', chatId]});
             queryClient.setQueriesData({queryKey: ['lastMessages']}, (messages) => {
            if (!messages) return [];
            const lastMessages = messages.filter(msg => String(msg._id) !== String(data._id));
            return [...lastMessages, data];
    }     )
            }
        });
    const {mutateAsync: readMessageMutation, } = useMutation({
        mutationFn: async (messageId)=>{
            return( api.markMessageAsRead(messageId))
        }, 
        onSuccess: (data)=>{
            socket.emit('readMessage', data);
             queryClient.setQueryData(['messages', data.senderId], (oldMessages) =>{
            if (!oldMessages) return [];
            return oldMessages.map(msg => {
                if (String(msg._id) === String(data._id)) {
                    return { ...msg, read: true };
                }
                return msg;
            })
        });
        }
    })
    const {mutateAsync : deleteMessageMutation, } = useMutation({
        mutationFn: async (messageId)=>{
            return( api.deleteMessage(messageId))
        }, 
        onSuccess: (data)=>{
            socket.emit('deleteMessage', data);
            queryClient.setQueryData(['messages', chatId], (oldMessages) =>{
            if (!oldMessages) return [];
                    return oldMessages.filter(msg => String(msg._id) !== String(data._id));  
        });
        }
    })
   
    const {data: messages = []} = useQuery({   
        queryKey: ['messages', chatId],
        queryFn: () => api.getConversation(chatId),
        enabled: !!chatId

    }); 
    const {data: lastMessages} = useQuery({
        queryKey: ['lastMessages'],
        queryFn: () => api.getLastMessages(),
        onSuccess: (data)=>{
            socket.emit('lastMessages', data)

        },
        enabled: !!currentUser,
      });


    return{messages, sendMessage: sendMessageMutation, readMessage: readMessageMutation , deleteMessage: deleteMessageMutation, lastMessages};
}
