
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
        console.log(base64String, userId)
        return api.uploadAvatar(base64String, userId)
    },
    mutationKey: ['updateAvatar', userId],
    onSuccess: (data)=>{
        queryClient.invalidateQueries({queryKey: ['users', data.user]});
        queryClient.setQueryData(['profile', SelectedId], (oldProfile) => {
                if (!oldProfile) return undefined;
                return { 
                    ...oldProfile, 
                    avatar: data.file 
                };
            });
        socket.emit('updateAvatar', {
            avatar: data.file,
            user: userId
        })
    }});
      return{profile ,updateAvatar, error, isLoading }
    }
