import eye0 from "../../pictures/eye0.png"
import eye1 from "../../pictures/eye1.png"
import NoNo from "../../pictures/NoNo.png"
import iconDelete from "../../pictures/iconDelete.png"
import { useNavigate } from 'react-router-dom';
import  './chat.css'
import iconBack from '../../pictures/iconBack.png'
import iconSend from '../../pictures/iconSend.png'
import {useState} from 'react'


export default function Chat({ currentUser, messages, sendMessage, NewMessageText, setNewMessageText, handleBack, selectedUser, deleteMessage}){
   const [messageClickId, setMessageClickId] = useState(null)
    const navigate = useNavigate();

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
        sendMessage(NewMessageText)
        setNewMessageText('')
    }
    const handleProfile=()=>{
        if(selectedUser){
            navigate(`/profile/${selectedUser.email}`)
        }
    }
    console.log('CurrentUser ID:', currentUser);
console.log('SenderID:', messages.senderId);
console.log('messages', messages)
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
                                key={msg._id}
                                className={msg.senderId === currentUser ? 'message-sent' : 'message-recived'} onClick={()=>handleMessageClick(msg._id)}>
                                <p style={{ margin: 0 }}>{msg.text}</p>
                                {msg.read ? (<img src={eye1} alt="read" className="loader"></img>) : (<img src={eye0} alt="read" className="loader"></img>)}
                                {messageClickId === msg._id && (
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