import { useState, useEffect } from 'react';
import api from '../services/api.js';
import {useQuery, useMutation, mutateAsync, useQueryClient} from '@tanstack/react-query'
 

const convertFileToBase64 = async (file) => {
return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
             reader.readAsDataURL(file);

        });
    }
   export function useProfile (email){
    const queryClient = useQueryClient()
const {data: profile = [], isLoading, error } = useQuery({
    queryKey: ['profile', email],
    queryFn: () => api.getProfile(email),
    enabled: !!email,
      })

        const {mutateAsync: editAvatarMutation, } = useMutation({
    mutationFn: async (file)=>{
        const base64String = await convertFileToBase64(file);
        api.uploadAvatar(email, base64String)
    },
    mutationKey: ['updateAvatar', email],
    onSuccess: ()=>{
        queryClient.invalidateQueries({queryKey: ['profile', email]}); 
    }});
      return{profile ,editAvatarMutation, error, isLoading }
    }
