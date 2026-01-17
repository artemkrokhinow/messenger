import React, {useState, useEffect} from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';
import './Profile.css'  
import Header from '../Header.jsx'
import {useProfile, uploadAvatar} from '../hooks/useProfile.js'
import picture from "../picture.jpg"


function ProfilePage(){
const navigation = useNavigate();
const {email} = useParams() 
const {profile, error} = useProfile(email)
const handleBack=()=>{
            navigation('/main')
}

const handleImg = async (event) => {
    const file = event.target.files[0];
    await uploadAvatar(email, file);
    this.render();
}    


    return(
         <div className="profile-container">
            <Header />
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
                                <img src={profile?.avatar} alt="User Avatar" className="avatar-image" />
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