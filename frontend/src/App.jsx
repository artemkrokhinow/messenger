import {useState, useEffect} from 'react';
import LoginPage from './LoginPage.jsx'
import RegistrationPage from './RegistrationPage.jsx'
import { Route, Routes, Link, Navigate, BrowserRouter} from 'react-router-dom';
import MainPage from './MainPage.jsx';
import {jwtDecode} from 'jwt-decode';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import api from './services/api.js';
const queryClient = new QueryClient();

function App() {
  const [ token ,setToken  ] = useState(localStorage.getItem('token'))
  const handleLogout = ()=>{
    localStorage.removeItem('token')
    setToken(null)
  }
  let currentUserEmail = null;
  let currentUserId = null;
  if (token) {
 currentUserEmail = jwtDecode(token).email;
 currentUserId = jwtDecode(token).id;
  }

  const [isBackendLoaded, setIsBackendLoaded] = useState(false);

  useEffect(() => {
    let timeout;
    const checkBackend = async () => {
      const isOk = await api.ping();
      if (isOk) {
        setIsBackendLoaded(true);
      } else {
        timeout = setTimeout(checkBackend, 2000);
      }
    };
    checkBackend();
    return () => clearTimeout(timeout);
  }, []);

  if (!isBackendLoaded) {
    return (
      <div className="global-loader">
        <div className="spinner"></div>
        <p>Connecting to server...</p>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId="874385142799-7rbrkp4ro33ci7tg88odkbt4lb279f9d.apps.googleusercontent.com">
    <QueryClientProvider client={queryClient}>
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
   <Route path = '/main' element= {<MainPage token={token} setToken={setToken} handleLogout={handleLogout} currentUserEmail = {currentUserEmail} />} />
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
    </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;