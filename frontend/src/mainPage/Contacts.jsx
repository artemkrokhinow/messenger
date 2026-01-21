import React, {useState, useEffect} from 'react'; 
import {useUsers} from '../hooks/useUsers.js'
import {useProfile} from '../hooks/useProfile.js'
import NoNo from "../pictures/NoNo.png"

export default function Contacts({user, onClick, isSelected }){
    const {profile} = useProfile(user.email)
    return(
                            <li key={user._id}>
                                <button className={`user-button ${isSelected ? 'selected' : ''}`} onClick={() => onClick(user)}>
                                    <img src={profile?.avatar || NoNo} alt="User Avatar" className="contact-avatar"/>
                                    {user.name}
                                    
                                </button>
                            </li>)}           