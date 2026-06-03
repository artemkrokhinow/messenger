import eye0 from "../../pictures/eye0.png"
import eye1 from "../../pictures/eye1.png"
import iconDelete from "../../pictures/iconDelete.png"
import { useNavigate } from 'react-router-dom';
import  './chat.css'
import iconBack from '../../pictures/iconBack.png'
import iconSend from '../../pictures/iconSend.png'
import {useState, useRef, useEffect} from 'react'
import {useQueryClient} from '@tanstack/react-query'


export default function Chat({ currentUser, messages, sendMessage, NewMessageText, setNewMessageText, handleBack, selectedUser, deleteMessage, editMessage, readMessage, onlineUsers}){
const queryClient = useQueryClient();
   const [messageClickId, setMessageClickId] = useState(null)
   const [editingMessageId, setEditingMessageId] = useState(null)
   const navigate = useNavigate();
   const observer = useRef(null)
useEffect(()=>{
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    }
      
observer.current = new IntersectionObserver((entries) => {

                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.target.dataset.read === 'false' && entry.target.dataset.senderId !== currentUser) {
                    readMessage(entry.target.dataset._id)
                } 
            });
            }, observerOptions);
  }, [currentUser])
            useEffect(()=>{
    if(observer.current){
 messages.forEach(msg => {
    const e = document.getElementById(msg._id)
    if (e){
        observer.current.observe(e)
    }
 })
    }
},[messages])
    const handleMessageClick = (messageId) => {
        
            setMessageClickId(messageId)
            if(messageId === messageClickId ){
                setMessageClickId(null)
        } else {
            setMessageClickId(messageId)
        }
    }
    const handeMessageDelete = (messageId) => {
        deleteMessage(messageId);
    }
      const handleSendMessage =(event)=>{
        event.preventDefault();
        if (!NewMessageText.trim()) return;
        if (editingMessageId) {
            editMessage({messageId: editingMessageId, text: NewMessageText});
            setEditingMessageId(null);
        } else {
            sendMessage({receiverId : selectedUser._id, text : NewMessageText, senderId : currentUser});
        }
        setNewMessageText('')
    }
    const handleEditClick = (msg) => {
        setEditingMessageId(msg._id);
        setNewMessageText(msg.text);
        setMessageClickId(null);
    }
    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setNewMessageText('');
    }
     const isOnline = onlineUsers?.includes(selectedUser?._id)
    return(
   <main className="chat-area">
                      
                     
                    
                           {!selectedUser ? (<div className='notChoiceUser'>choice user</div>) : (
                            <><div className="chat-header">
                                <button className="back-button-mobile" onClick={handleBack}>
                                 <img className= 'back-icon-mobile' src={iconBack} alt="Back Icon"/>
                                </button>
                                <div className='chat-header-info'>
                                    <img src={selectedUser?.avatar} alt="User Avatar" className="chat-header-avatar" />
                                    <div className="chat-header-text">
                                        <span className="chat-header-name">{selectedUser?.name}</span>
                                        {isOnline ? (<span className="chat-header-status online">Online</span>) : (<span className="chat-header-status offline">Offline</span>)}
                                    </div>
                                </div>

                </div><div id='messageList'className='message-list'>
                        {messages.map(msg => {
                            const timeString = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '10:30 AM';
                            return (
                            <div
                                id={msg._id}
                                key={msg._id}
                                data-sender-id={msg.senderId}
                                data-read={msg.read}
                                data-_id={msg._id}
                                className={`${msg.senderId === currentUser ? 'message-sent' : 'message-recived'} ${messageClickId === msg._id ? 'selected' : ''}`} onClick={()=>handleMessageClick(msg._id)}>
                                <p style={{ margin: 0 }}>{msg.text}</p>
                                <div className="message-meta">
                                    <span className="message-time">{timeString}</span>
                                    {msg.senderId === currentUser && (
                                        msg.read ? (
                                            <svg className="check-icon read" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 6 7 17 2 12"></polyline><polyline points="22 6 11 17 7 13"></polyline></svg>
                                        ) : (
                                            <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        )
                                    )}
                                </div>
                                {messageClickId === msg._id && msg.senderId === currentUser && (
                                    <div className="message-context-menu">
                                        <button className="context-item edit-btn" onClick={(e) => { e.stopPropagation(); handleEditClick(msg); }}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                            Edit
                                        </button>
                                        <button className="context-item delete-btn" onClick={(e) => { e.stopPropagation(); handeMessageDelete(msg._id); }}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                            );
                        })}
                    </div><form className="message-form" onSubmit={handleSendMessage}>
                        {editingMessageId && (
                            <button type="button" className="cancel-edit-btn" onClick={handleCancelEdit} title="Cancel Edit">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        )}
                        <input
                            className="message-input"
                            value={NewMessageText}
                            placeholder={editingMessageId ? 'Edit your message...' : 'write a message'}
                            onChange={(event) => setNewMessageText(event.target.value)} />
                        <button className="send-button" type='submit'>
                            <img className="send-icon" src={iconSend} alt="Send"></img>
                        </button>
                    </form></>
                    )}
                            
                 </main>)
}