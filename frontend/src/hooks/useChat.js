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
            queryClient.setQueryData(['users'], user => {
        
        const userFind = (user.find(u => 
                                u._id === data.receiverId
                                ))
        if(!userFind) return user
        const userFilter = user.filter(u => 
                                u._id !== data.receiverId
                                 )
            return [userFind ,...userFilter]
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
                    }})
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
        enabled: !!currentUser,
      });


    return{messages, sendMessage: sendMessageMutation, readMessage: readMessageMutation , deleteMessage: deleteMessageMutation, lastMessages};
}
