import React, {useState, useEffect} from 'react'; 
import './App.css'  
import Header from './header/Header.jsx'
import {jwtDecode} from 'jwt-decode';
import { socket } from './services/socket.js'; 
import {useChat} from './hooks/useChat.js'
import {useUsers} from './hooks/useUsers.js'
import Contacts from './mainPage/contacts/Contacts.jsx';
import Chat from './mainPage/chat/Chat.jsx';
import {QueryClient} from '@tanstack/react-query'
import {useSocketEvent} from './hooks/useSocketEvent.js'
 
const queryClient = new QueryClient()

function MainPage({token, setToken}){

    const [selectedUser, setSelectedUser] = useState()
    const {id :currentUser} = (jwtDecode(token))
    const {users, error: usersError} = useUsers(token, currentUser)
    const {messages, sendMessage, deleteMessage} = useChat(token, selectedUser, currentUser)
    const error = usersError ;
    const [NewMessageText, setNewMessageText] = useState('');   
    useSocketEvent(currentUser, selectedUser?._id)
    if(localStorage.getItem('token') === null) window.location.href = '/login'
    useEffect(()=>{
       if(currentUser && !socket.connected){
        socket.connect();
 socket.emit('addUser',currentUser)
       }return () => {
            socket.disconnect();
        }
    }, [currentUser])
    
         
   
    const handleLogout = ()=>{
        setToken(null)
        localStorage.removeItem('token')
    }
    const handleBack = ()=>{
        setSelectedUser(null)
    }



    return(
         <div className="app-container">
            <Header user={users.find(user => user._id === currentUser)}/>
               <div className="main-layout">
                  <aside className={`sidebar ${selectedUser ? 'hidden-mobile' : ''}`}>
                <div className="sidebar-header">
                    <h2>Contacts</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <ul className="user-list">
                        {users.filter(user => user._id !== currentUser).map(user => (
                        <Contacts
                        key={user._id}
                        user={user}
                        onClick={setSelectedUser}
                        isSelected={selectedUser?._id === user?._id}
                    />))}
                      
                    
                    </ul>
                    <button className="logout-button" onClick={handleLogout} style={{ marginTop: 'auto' }}>Logout</button>
                 
                </div>
                </aside>
                <div className={`chat-area ${!selectedUser ? 'hidden-mobile' : ''}`}>
                 <Chat 
                        messages={messages}
                        sendMessage={sendMessage}
                        NewMessageText={NewMessageText}
                        setNewMessageText={setNewMessageText}
                        handleBack={handleBack}
                        selectedUser={users.find(user => user._id === selectedUser?._id)}
                        deleteMessage={deleteMessage}
                        currentUser={currentUser}
                       /> 
                       </div>
            </div>
          
        </div>
        
    );
}
export default MainPage