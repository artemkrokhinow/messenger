import { useNavigate, useParams } from 'react-router-dom';
import './Profile.css'  
import Header from '../header/Header.jsx'
import {useProfile} from '../hooks/useProfile.js'
import {useUsers} from '../hooks/useUsers.js'
import iconBack from '../pictures/iconBack.png'
import NoNo from "../pictures/NoNo.png"
import {useQueryClient} from '@tanstack/react-query'

function ProfilePage({token ,currentUserEmail, currentUserId}) {
const queryClient = useQueryClient()
const navigation = useNavigate();
const {email} = useParams() 
const {users} = useUsers(token)
const viewedUser = users?.find(user => String(user.email) === String(email))
const {profile, error, updateAvatar} = useProfile(viewedUser?._id, currentUserId)

const currentUserData = users?.find(u => String(u._id) === String(currentUserId))

const handleBack=()=>{
            navigation('/main')
}

const handleImg = async (event) => {
    const file = event.target.files[0];
    if (file) {
    await updateAvatar({file : file , userId : currentUserId});
    }
}    


    return(  
    <div className="profile-container">
            <Header user={currentUserData}/>
             
               <div className="profile-layout">
                  <aside className="profile-sidebar">

          
           <button className="back-button-mobile-profile" onClick={handleBack}>
            <img className= 'back-icon-mobile-profile' src={iconBack} alt="Back Icon"/>
           </button>
            <h2 className="profile-line">User Profile</h2>
            
            {profile && (
                <div>
                    <h2><div id = 'avatarIMG' className="avatar-container">
                       
                            {profile.user === currentUserId  ? (
<div>
    <label className="change-avatar-btn">
                                <img key={profile?.avatar} src={profile?.avatar|| NoNo} alt="User Avatar" className="avatar-image" />
                                {profile.user === currentUserId ?(<input type='file' onChange={handleImg} style={{ display: 'none' }} /> ) : null}
                
            </label>
</div>
                            ) : (
                               <div> 
                                     <img key={profile?.avatar} src={profile?.avatar|| NoNo} alt="User Avatar" className="avatar-image" />
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