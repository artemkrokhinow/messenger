import { Link, useNavigate} from 'react-router-dom';
import iconApp from "../pictures/iconApp.png"
import './header.css'; 
import {useProfile} from '../hooks/useProfile.js'

function Header({user}) {
    const navigate = useNavigate(); 
    const { updateAvatar } = useProfile(null, user?._id);

    const handleImg = async (event) => {
        const file = event.target.files[0];
        if (file && user?._id) {
            await updateAvatar({file : file , userId : user._id});
        }
    }

    return(
        <header className="app-header">
            <nav className="header-nav">
                <Link to="/main" className="header-logo-link">
                    <img src={iconApp} alt="Messenger Logo" className="app-logo"/>
                </Link>
                <label className='profile-btn' title="Change Avatar" style={{ cursor: 'pointer' }}>
                    <img 
                        src={user?.avatar} 
                        alt="User Avatar" 
                        className="header-avatar"
                    />
                    <input type='file' accept="image/*" onChange={handleImg} style={{ display: 'none' }} />
                </label>

            </nav>
        </header>
    )
}
export default Header;