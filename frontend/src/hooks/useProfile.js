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
  const convertFileToBase64 = async (file) => {
return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
             reader.readAsDataURL(file);

        });
    }
  export const uploadAvatar = async (email, file) => {
    try {
        const base64String = await convertFileToBase64(file);
        await api.uploadAvatar(email, base64String);
    } catch (err) {
        console.error('Error uploading avatar:', err);
        throw err;
    }}