import React, {useState, useEffect} from 'react'; 

import './App.css'  
import Header from './header/Header.jsx'
import { io } from 'socket.io-client';
import {jwtDecode} from 'jwt-decode';
import { socket } from './services/socket.js'; 
import {useChat} from './hooks/useChat.js'
import {useUsers} from './hooks/useUsers.js'
import {useProfile} from './hooks/useProfile.js'

import Contacts from './mainPage/Contacts.jsx';
import Chat from './mainPage/Chat.jsx';


 

function MainPage({token, setToken}){

    const [selectedUser, setSelectedUser] = useState()
    const {id: currentUser} = (jwtDecode(token))
    const {users, error: usersError} = useUsers(token, currentUser)
    const {messages, error: chatError, sendMessage} = useChat(token, selectedUser, currentUser)
    const error = usersError || chatError;
    const [NewMessageText, setNewMessageText] = useState('');
    const {profile} = useProfile(selectedUser?.email)
    
    useEffect(()=>{
        socket.connect()
         socket.emit('addUser',currentUser)
         return () => {
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
            <Header/>
               <div className="main-layout">
                  <aside className={`sidebar ${selectedUser ? 'hidden-mobile' : ''}`}>
                <div className="sidebar-header">
                    <h2>Contacts</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <ul className="user-list">
                        {users.map(user => (
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
                       selectedUser={selectedUser}
                       currentUser={currentUser}
                       messages={messages}
                       sendMessage={sendMessage}
                       profile={profile}
                       NewMessageText={NewMessageText}
                       setNewMessageText={setNewMessageText}
                          handleBack={handleBack}
                       /> 
                       </div>
            </div>
          
        </div>
        
    );
}
export default MainPage