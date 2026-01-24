import eye0 from "../pictures/eye0.png"
import eye1 from "../pictures/eye1.png"
import NoNo from "../pictures/NoNo.png"
import { useNavigate } from 'react-router-dom';


export default function Chat({selectedUser, currentUser, messages, sendMessage, profile, NewMessageText, setNewMessageText, handleBack}){
    const navigate = useNavigate();
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
   <main className="chat-area">
                     <button className="back-button-mobile" onClick={handleBack}>Back</button>
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
                    
                 </main>)
}