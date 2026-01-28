import React, {useState, useEffect} from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';
import './Profile.css'  
import Header from '../header/Header.jsx'
import {useProfile} from '../hooks/useProfile.js'
import iconBack from '../pictures/iconBack.png'
import NoNo from "../pictures/NoNo.png"

function ProfilePage({currentUserEmail}) {
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

          
           <button className="back-button-mobile-profile" onClick={handleBack}>
            <img className= 'back-icon-mobile-profile' src={iconBack} alt="Back Icon"/>
           </button>
            <h2 className="profile-line">User Profile</h2>
            
            {profile && (
                <div>
                    <h2><div id = 'avatarIMG' className="avatar-container">
                       
                            {profile.email === currentUserEmail  ? (
<div>
    <label className="change-avatar-btn">
                                <img src={profile?.avatar|| NoNo} alt="User Avatar" className="avatar-image" />
                                {profile.email === currentUserEmail ?(<input type='file' onChange={handleImg} style={{ display: 'none' }} /> ) : null}
                
            </label>
</div>
                            ) : (
                               <div> 
                                     <img src={profile?.avatar|| NoNo} alt="User Avatar" className="avatar-image" />
                               </div>
                                
                            )}
                </div>
</h2>
         
                    <p className="profile-line"><strong>Email:</strong> {email}</p>
                    <p className="profile-line"><strong>name:</strong>{profile.name}</p>
                    <p className="profile-line"><strong>Description:</strong> {profile.description}</p>
                    <p className="profile-line"><strong>Birthday:</strong> {profile.birthday}</p>
                    <p className="profile-line"><strong>Last Seen:</strong> {profile.lastSeen}</p>
                </div>
            )}
            <main className="profile-data">
          </main>
          </aside>
           </div>
        </div>



   
                                    

  
    );
}
export default ProfilePage