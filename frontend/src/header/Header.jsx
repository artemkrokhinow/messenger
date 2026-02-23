import { Link, useNavigate} from 'react-router-dom';
import iconApp from "../pictures/iconApp.png"
import './header.css'; 

function Header({user}) {
    const navigate = useNavigate(); 


const handleProfile=()=>{
        if(user){
            navigate(`/profile/${user.email}`)
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
                        src={user?.avatar} 
                        alt="User Avatar" 
                        className="header-avatar"
                    />
                </button>

            </nav>
        </header>
    )
}
export default Header;