import {useQuery} from '@tanstack/react-query'
import api from '../services/api.js';

   export function useUsers (token, currentUser){
        const {data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.getContacts(),
    enabled: !!token,
    select: (data) => data.filter(user => user._id !== currentUser),
    
      });
return{users , error, isLoading};
}
  
