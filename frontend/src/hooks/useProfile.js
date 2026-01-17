import { useState, useEffect } from 'react';
import api from '../services/api.js';

   export function useProfile (email){
const [profile, setProfile] = useState(null);
const [error, setError] = useState('');
 useEffect(()=>{
    if( !email) return;
    
        const  fetchProfile = async ()=>{
            try{
                setError('')
                const data = await api.getProfile(email)
                setProfile(data)
                console.log("User profile:", data);
            }catch(err){
                setError(err.message)
            }

        }
        fetchProfile()
},[email])
return{profile, error}
  }
  export const uploadAvatar = async (email, file) => {
    try {
        await api.uploadAvatar(email, file);
    } catch (err) {
        console.error('Error uploading avatar:', err);
        throw err;
    }}