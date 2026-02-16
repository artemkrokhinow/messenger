import eye0 from "../../pictures/eye0.png"
import eye1 from "../../pictures/eye1.png"
import iconDelete from "../../pictures/iconDelete.png"
import { useNavigate } from 'react-router-dom';
import  './chat.css'
import iconBack from '../../pictures/iconBack.png'
import iconSend from '../../pictures/iconSend.png'
import {useState, useRef, useEffect} from 'react'
import {useQueryClient} from '@tanstack/react-query'


export default function Chat({ currentUser, messages, sendMessage, NewMessageText, setNewMessageText, handleBack, selectedUser, deleteMessage, readMessage}){
const queryClient = useQueryClient();
   const [messageClickId, setMessageClickId] = useState(null)
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
        if (!NewMessageText.trim() === 0 ) return;
        sendMessage({receiverId : selectedUser._id, text : NewMessageText, senderId : currentUser});
        setNewMessageText('')
    }
    const handleProfile=()=>{
        if(selectedUser){
            navigate(`/profile/${selectedUser.email}`)
        }
    }

    return(
   <main className="chat-area">
                      
                     
                    
                           {!selectedUser ? (<div className='notChoiceUser'>choice user</div>) : (
                            <><div className="chat-header">
                                <button className="back-button-mobile" onClick={handleBack}>
                                 <img className= 'back-icon-mobile' src={iconBack} alt="Back Icon"/>
                                </button>
                    <button className='profile-button' onClick={handleProfile}>
                        <img src={selectedUser?.avatar} alt="User Avatar" className="avatar" />
                        <span className="chat-name">{selectedUser?.name}</span>
                    </button>
                </div><div className='message-list'>
                        {messages.map(msg => (
                            <div
                                id={msg._id}
                                key={msg._id}
                                data-sender-id={msg.senderId}
                                data-read={msg.read}
                                data-_id={msg._id}
                                className={msg.senderId === currentUser ? 'message-sent' : 'message-recived'} onClick={()=>handleMessageClick(msg._id)}>
                                <p style={{ margin: 0 }}>{msg.text}</p>
                                {msg.read ? (<img src={eye1} alt="read" className="loader"></img>) : (<img src={eye0} alt="read" className="loader"></img>)}
                                {messageClickId === msg._id && msg.senderId === currentUser && (
                                <button onClick ={() => handeMessageDelete(msg._id)} className="message-delete"><img className='iconDelete' src={iconDelete} alt="Delete"></img></button>)}
                            </div>
                            
                        ))}
                    </div><form className="message-form" onSubmit={handleSendMessage}>
                        <input
                            className="message-input"
                            value={NewMessageText}
                            placeholder='write a message'
                            onChange={(event) => setNewMessageText(event.target.value)} />
                        <button className="send-button" type='submit'>
                            <img className="send-icon" src={iconSend} alt="Send"></img>
                        </button>
                    </form></>
                    )}
                            
                 </main>)
}