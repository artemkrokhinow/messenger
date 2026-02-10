
import './contacts.css'

export default function Contacts({user, isSelected, onClick}){
    return(
                            <li key={user._id}>
                                <button className={`user-button ${isSelected ? 'selected' : ''}`} onClick={() => onClick(user._id)}>
                                    <img src={user.avatar} alt="User Avatar" className="contact-avatar"/>
                                    {user.name}

                                </button>
                            </li>)}           