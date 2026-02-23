
import api from '../services/api.js';
import {useQuery, useMutation, mutateAsync, useQueryClient} from '@tanstack/react-query'
 import { socket } from '../services/socket.js';

const convertFileToBase64 = async (file) => {
return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
             reader.readAsDataURL(file);

        });
    }
   export function useProfile (SelectedId, userId){
    const queryClient = useQueryClient()
const {data: profile = [], isLoading, error } = useQuery({
    queryKey: ['profile', SelectedId],
    queryFn: () => api.getProfile(SelectedId),
    enabled: !!SelectedId,
      })

        const {mutateAsync: updateAvatar, } = useMutation({
    mutationFn: async ({file, userId})=>{
        const base64String = await convertFileToBase64(file);
        return api.uploadAvatar(base64String, userId)
    },
    mutationKey: ['updateAvatar', userId],
    onSuccess: (data)=>{        
             queryClient.setQueryData(['profile', String(data.user)], (oldProfile) => {
                if (!oldProfile) return undefined;
                if (String(oldProfile.user) !== String(data.user)) return oldProfile
                return { ...oldProfile, avatar: data.avatar };
            });
            queryClient.setQueriesData({queryKey: ['users']}, (oldUser) => {
                if (!oldUser) return undefined;
                return oldUser.map(u => {if (String(u._id) !== String(data.user)) return u  
                return { ...u, avatar: data.avatar };
            })});
            if (!socket.connected) {
            socket.connect();
        }
        socket.emit('updateAvatar', {
            avatar: data.avatar,
            user: userId
        })
    }});
      return{profile ,updateAvatar, error, isLoading }
    }
