import React, {useState, useEffect} from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';
import './Profile.css'  
import Header from '../header/Header.jsx'
import {useProfile} from '../hooks/useProfile.js'


function ProfilePage({currentUserEmail}){
const navigation = useNavigate();
const {email} = useParams() 
const {profile, error, updateAvatar} = useProfile(email)
const handleBack=()=>{
            navigation('/main')
}

const handleImg = async (event) => {
    const file = event.target.files[0];
    if (file) {
    await updateAvatar(currentUserEmail, file);
    }
}    


    return(
         <div className="profile-container">
            <Header profile={profile}/>
               <div className="profile-layout">
                  <aside className="profile-sidebar">
                <div className="profile-sidebar-header">
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <ul className="profile-user-list">

                                <button className='back-button' onClick={handleBack}>
                                    Go back to Chat
                                </button>

                    </ul>
                 
                </div>
                </aside>
               

                         <h2><div id = 'avatarIMG' className="avatar-container">
                            {profile?.avatar !== '' ? (
<div>
                                <img src={profile?.avatar} alt="User Avatar" className="avatar-image" />
                                <label className="change-avatar-btn">
                Change Photo
                <input type='file' onChange={handleImg} style={{ display: 'none' }} />
            </label>
</div>
                            ) : (
                               <div> 
                                    <input type='file' name='inputImg' onChange={handleImg}></input>
                               </div>
                                
                            )}
                </div>
</h2>
                    

            
          <main className="profile-data">
           
            <h2 className="profile-line">User Profile</h2>
            {profile && (
                <div>
                    <p className="profile-line"><strong>Email:</strong> {email}</p>
                    <p className="profile-line"><strong>name:</strong>{profile.name}</p>
                    <p className="profile-line"><strong>Description:</strong> {profile.description}</p>
                    <p className="profile-line"><strong>Birthday:</strong> {profile.birthday}</p>
                    <p className="profile-line"><strong>Last Seen:</strong> {profile.lastSeen}</p>
                </div>
            )}
          </main>
           </div>
        </div>
        
    );
}
export default ProfilePage