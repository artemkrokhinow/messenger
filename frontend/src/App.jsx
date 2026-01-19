import React, {useState} from 'react'; 
import LoginPage from './LoginPage.jsx'
import RegistrationPage from './RegistrationPage.jsx'
import { Route, Routes, Link, Navigate, BrowserRouter} from 'react-router-dom';
import MainPage from './MainPage.jsx';
import ProfilePage from './Profile/ProfilePage.jsx';
import {jwtDecode} from 'jwt-decode';

function App() {
  const [ token ,setToken  ] = useState(localStorage.getItem('token'))
  const handleLogout = ()=>{
    localStorage.removeItem('token')
    setToken(null)
  }
  let currentUserEmail = null;
  if (token) {
 currentUserEmail = jwtDecode(token).email;
  }
  return (
    <BrowserRouter>
    <div className="App">
      
     {!token && (
        <nav>
          <Link to = '/Login'></Link> 
       <Link to = '/Registration'></Link>
      
    </nav>
  )}
    <Routes>
      {token ? (
        <>
        <Route path = '*' element={<Navigate to = '/main'/>}/>
   <Route path = '/main' element= {<MainPage token={token} setToken={setToken} handleLogout={handleLogout} currentUserEmail = {currentUserEmail}/>} />
    <Route path = '/profile/:email' element= {<ProfilePage token={token} currentUserEmail = {currentUserEmail}/> } />
   </>
      ):(
        <>
         <Route path = '/Login' element ={<LoginPage setToken = {setToken}/>} />
        <Route path = '/Registration' element ={<RegistrationPage setToken = {setToken}/>}/>
        <Route path = '*' element={<Navigate to = '/login'/>}/>
        
        </>
      )}
    </Routes>


    </div>
    </BrowserRouter>
  );
}

export default App;