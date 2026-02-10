import api from '../services/api.js';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { socket } from '../services/socket.js';
export function useChat(selectedUser){
    const queryClient = useQueryClient()
    const {mutateAsync: sendMessageMutation, } = useMutation({
        mutationFn: async (messageData)=>{
          console.log(messageData)
            return( api.sendMessage(messageData))
        },
        onSuccess: (data)=>{
            socket.emit('sendMessage', data);
            queryClient.invalidateQueries({queryKey: ['messages', selectedUser]});
        }
    }); 
   
    const {data: messages = []} = useQuery({   
        queryKey: ['messages', selectedUser],
        queryFn: () => api.getConversation(selectedUser),
        enabled: !!selectedUser

    }); 
    return{messages, sendMessage: sendMessageMutation}
}
