
import './contacts.css'

export default function Contacts({user, isSelected, onClick, onlineUsers, lastMessages}){
    const isOnline = onlineUsers?.includes(user._id)
    const lastMessage = lastMessages?.find(m => String(m.senderId) === user._id || String(m.receiverId) === user._id)
    return(                 

            
                            <li key={user._id}>
                                <button className={`user-button ${isSelected ? 'selected' : ''}`} onClick={() => onClick(user._id)}>
                                    <div className="contact-avatar-wrapper">
                                        <img src={user.avatar} alt="User Avatar" className="contact-avatar"/>
                                        {isOnline ? (<div className="green-dot status-dot"></div>) : (<div className="gray-dot status-dot"></div>)}
                                    </div>
                                    <div className="text-container">
                                        <p className="user-name">{user.name}</p> 
                                        {lastMessage && <p className="last-message">{lastMessage.text}</p>}
                                    </div>
                                </button>
                            </li>
            )
}           