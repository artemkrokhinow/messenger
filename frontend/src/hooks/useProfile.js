import { useState, useEffect } from 'react';
import api from '../services/api.js';

   export function useProfile (token,email){
const [profile, setProfile] = useState([]);
const [error, setError] = useState('');
 useEffect(()=>{
    if(!token || !email) return;
    
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
},[token, email])
return{profile, error}
  }
 