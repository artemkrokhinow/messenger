import React, {useState, useEffect} from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';
import './App.css'  
import Header from './Header.jsx'
import {useProfile} from './hooks/useProfile.js'


function ProfilePage(){
 const navigation = useNavigate();
  const {email} = useParams() 
 const {profile, error} = useProfile(email)
  const handleBack=()=>{
             navigation('/main')
     }
    return(
         <div className="app-container">
            <Header />
               <div className="main-layout">
                  <aside className="sidebar">
                <div className="sidebar-header">
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <ul className="user-list">

                                <button className='user-button' onClick={handleBack}>
                                    Go back to Chat
                                </button>

                    </ul>
                 
                </div>
                </aside>
                
            </div>
          <main className="chat-area">
            <h2>User Profile</h2>
            {profile && (
                <div>
                    <p><strong>Email:</strong> {email}</p>
                </div>
            )}
          </main>
        </div>
        
    );
}
export default ProfilePage