import React, {useState, useEffect} from 'react'; 
import { useNavigate } from 'react-router-dom';
import './App.css'  
import Header from './Header.jsx'
import { io } from 'socket.io-client';
import {jwtDecode} from 'jwt-decode';
import { socket } from './services/socket.js'; 
import {useChat} from './hooks/useChat.js'
import {useUsers} from './hooks/useUsers.js'

 

function MainPage({token, setToken}){
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState()
    const {id: currentUser} = (jwtDecode(token))
    const {users, error: usersError} = useUsers(token, currentUser)
    const {messages, error: chatError, sendMessage} = useChat(token, selectedUser, currentUser)
    const error = usersError || chatError;
    const [NewMessageText, setNewMessageText] = useState('');
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
            <Header />
               <div className="main-layout">
                  <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Contacts</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <ul className="user-list">
                        {users.map(user => (
                            <li key={user._id}>
                                <button className={`user-button ${selectedUser?._id === user._id ? 'selected' : ''}`} onClick={() => setSelectedUser(user)}>
                                    {user.email}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button className="logout-button" onClick={handleLogout} style={{ marginTop: 'auto' }}>Logout</button>
                 
                </div>
                </aside>
                <main className="chat-area">
                     
                    {selectedUser ? (
                       <>
                    <div className="chat-header">
                            <h2>Chat with 
                                <button className = 'alternative-button' onClick={handleProfile}>{selectedUser?.email}</button></h2>
                            </div>
                            <div className = 'message-list'>
                                {messages.map( msg => (
                                    <div
                                        key = {msg._id }
                                        className = {msg.senderId === currentUser ? 'message-sent' : 'message-recived'}>
                                            <p style={{margin: 0 }}>{msg.text}</p>
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