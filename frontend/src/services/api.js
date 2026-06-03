const BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

 async function request(url , options = {}){
    const token = localStorage.getItem('token')
    const headers = {};
    if(!(options.body instanceof FormData)){
        headers['Content-Type'] = 'application/json';
    }
    if(token){
        headers['Authorization'] = `Bearer ${token}`
      
    } const config = {...options, headers}
    try{
        const response = await fetch (BASE_URL + url, config)
        if(response.status === 401){
            localStorage.removeItem('token')
            window.location.href = '/login'
            console.log('Unauthorized! Redirecting to login.');
            return;
        }
        const data = await response.json()
        if(response.ok){
            return data 
    } else{
           throw new Error(data.message || 'API Error');
           
    }
    
}catch (error){
    console.error('API Service Error:', error, BASE_URL, url, config);
    throw error;
}

}
const api = {
    getContacts: ()=>{
       return  request('/contacts')
    }, 
    getProfile: (userId)=>{
        return request(`/profile/${userId}`, {cache: 'no-cache'}) 
    },
    getConversation: (userId)=>{
        return request(`/chat/${userId}`, {cache: 'no-cache'}) 
    },
    sendMessage: (messageData)=>{
        return request(`/chat`, {
            method: 'POST',
            body:JSON.stringify(messageData)
        })
    }, 
    markMessageAsRead: (messageId)=>{
        return request(`/chat/${messageId}`, {
            method: 'POST'
        })
    },
    deleteMessage: (messageId)=>{
        return request(`/chat/${messageId}`, {
            method: 'DELETE'
        })
    },
    editMessage: (messageId, text)=>{
        return request(`/chat/${messageId}`, {
            method: 'PUT',
            body: JSON.stringify({text})
        })
    },

    uploadAvatar: (file, userId) => {
        return request(`/profile/${userId}`, {
            method: 'POST',
            body:JSON.stringify({file : file})
        })},
    login:(email, password)=>{
        return request('/login',{
            method: 'POST',
            body:JSON.stringify({email, password})
        })
    },
    registration:(email, password, name)=>{
        return request('/registration',{
            method: 'POST',
            body:JSON.stringify({email, password, name})
        })
    },
    getLastMessages: ()=>{
        return request(`/chat`, {cache: 'no-cache'})
    },
    getOnlineUsers: ()=>{
        return request('/online-users', {cache: 'no-cache'})
    }

};
export default api; 
