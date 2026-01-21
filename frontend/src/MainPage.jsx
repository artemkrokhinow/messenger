import React, {useState, useEffect} from 'react'; 
import { useNavigate } from 'react-router-dom';
import './App.css'  
import Header from './header/Header.jsx'
import { io } from 'socket.io-client';
import {jwtDecode} from 'jwt-decode';
import { socket } from './services/socket.js'; 
import {useChat} from './hooks/useChat.js'
import {useUsers} from './hooks/useUsers.js'
import {useProfile} from './hooks/useProfile.js'
import NoNo from "./pictures/NoNo.png"
import Contacts from './mainPage/Contacts.jsx';
import eye0 from "./pictures/eye0.png"
import eye1 from "./pictures/eye1.png"

 

function MainPage({token, setToken}){
    const navigate = useNavigate();
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
    const handleSendMessage =(event)=>{
        event.preventDefault();
        if (!NewMessageText.trim() === 0 ) return;
        sendMessage(NewMessageText)
        setNewMessageText('')
    }
    const handleProfile=()=>{
        if(selectedUser){
            navigate(`/profile/${selectedUser.email}`)
        }
    }

    return(
         <div className="app-container">
            <Header/>
               <div className="main-layout">
                  <aside className="sidebar">
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
                <main className="chat-area">
                     
                    {selectedUser ? (
                       <>
                    <div className="chat-header">
                            <h2>
                                <button className = 'profile-button' onClick={handleProfile}>
                                    <img src={profile?.avatar || NoNo} alt="User Avatar" className="avatar"/>
                                    <span className="chat-name">{selectedUser?.name}</span>
                                    </button></h2>
                            </div>
                            <div className = 'message-list'>
                                {messages.map( msg => (
                                    <div
                                        key = {msg._id }
                                        className = {msg.senderId === currentUser ? 'message-sent' : 'message-recived'}>
                                            <p style={{margin: 0 }}>{msg.text}</p>
                                            {msg.read ? (<img src={eye1} alt="read"className="loader"></img>) : (<img src={eye0} alt="read"className="loader"></img>)} 
                                </div>
                                 ))}
                    </div>
                    
                        <form  className="message-form" onSubmit={handleSendMessage}>
                            <input   
                            className="message-input" 
                            value = {NewMessageText} 
                            placeholder='write a message' 
                            onChange={(event)=>setNewMessageText(event.target.value)} 
                            />
                            <button  className="send-button" type = 'submit'>send</button>
                         </form>
                      </>
                    ) : (
                        <div className="no-chat-selected">
                        <p>Select a contact to start a chat</p>
                        </div>
                    )}
                    
                 </main>
            </div>
          
        </div>
        
    );
}
export default MainPage