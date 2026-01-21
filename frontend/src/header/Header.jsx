import React, {useMemo}  from 'react';
import { Link, useNavigate} from 'react-router-dom';
import iconApp from "../pictures/iconApp.png"
import {useProfile} from '../hooks/useProfile.js'
import './header.css'; 
import {jwtDecode} from 'jwt-decode';

function Header() {
    const token = localStorage.getItem('token');
    const myEmail = useMemo(() => {
        if (!token) return null;
        try{
             return jwtDecode(token).email;
        }catch (e) {
            console.error('Invalid token:', e);
            return null;
        }
       
    }, [token]);
    const {profile} = useProfile(myEmail)
    const navigate = useNavigate();
      console.log("EMAIL:", myEmail); 
    const handleProfile=()=>{
        if(myEmail){
            navigate(`/profile/${myEmail}`)
            console.log("Navigate to profile" );
    }
    }
    return(
        <header className="app-header">
            <nav className="header-nav">
                <Link to="/main" className="header-logo-link">
                    <img src={iconApp} alt="Messenger Logo" className="app-logo"/>
                </Link>
                <button className='profile-btn' onClick={handleProfile} title="My Profile">
                    <img 
                        src={profile?.avatar} 
                        alt="User Avatar" 
                        className="header-avatar"
                    />
                </button>

            </nav>
        </header>
    )
}
export default Header;