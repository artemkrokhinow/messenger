import React, {useState, useEffect} from 'react'; 
import './App.css'  
import Header from './header/Header.jsx'
import {jwtDecode} from 'jwt-decode';
import { socket } from './services/socket.js'; 
import {useChat} from './hooks/useChat.js'
import {useUsers} from './hooks/useUsers.js'
import Contacts from './mainPage/contacts/Contacts.jsx';
import Chat from './mainPage/chat/Chat.jsx';
import {useQueryClient} from '@tanstack/react-query'
import {useSocketEvent} from './hooks/useSocketEvent.js'
 

function MainPage({token, setToken}){
    const queryClient = useQueryClient();
    const [NewMessageText, setNewMessageText] = useState('');   
    const [selectedUser, setSelectedUser] = useState()
    const {id :currentUser} = (jwtDecode(token))
    const {usersOnline ,users,error: usersError} = useUsers(token)
    const {messages, sendMessage, deleteMessage, readMessage, lastMessages} = useChat(selectedUser, currentUser);
    const error = usersError ;
    
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
    
    console.log(lastMessages)
    console.log(messages)
   
    const handleLogout = ()=>{
        setToken(null)
        localStorage.removeItem('token')
    }
    const handleBack = ()=>{
        setSelectedUser(null)
    }
const currentUserData = ()=>{
    if(users && users.length > 0){
    return users.find(user => String(user._id) === currentUser)
    }
}


    return(
         <div className="app-container">
            <Header user={currentUserData()}/>
               <div className="main-layout">
                  <aside className={`sidebar ${selectedUser ? 'hidden-mobile' : ''}`}>
                <div className="sidebar-header">
                    <h2>Contacts</h2>
                    {error && <p style={{ color: 'red' }}>{error.message}</p>}
                    <ul className="user-list">
                        {users.filter(user => user._id !== currentUser).map(user => (
                        <Contacts
                        key={user._id}
                        user={user}
                        lastMessages={lastMessages}
                        onClick={setSelectedUser}
                        isSelected={selectedUser === user?._id}
                        usersOnline={usersOnline}
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
                        selectedUser={users.find(user => String(user._id) === selectedUser)}
                        deleteMessage={deleteMessage}
                        currentUser={currentUser}
                        usersOnline={usersOnline}
                        readMessage={readMessage}
                       /> 
                       </div>
            </div>
          
        </div>
        
    );
}
export default MainPage