import { useQuery} from '@tanstack/react-query'
import api from '../services/api.js';

   export function useUsers (token){
        const {data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.getContacts(),
    enabled: !!token,
    
      });
       const {data: onlineUsers = []} = useQuery({
      queryKey: ['onlineUsers'],
      queryFn: ()=> [],
      staleTime: Infinity
    });
      
return{onlineUsers ,users, error, isLoading};
}
  
