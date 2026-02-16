import {useState} from 'react'; 
import LoginPage from './LoginPage.jsx'
import RegistrationPage from './RegistrationPage.jsx'
import { Route, Routes, Link, Navigate, BrowserRouter} from 'react-router-dom';
import MainPage from './MainPage.jsx';
import ProfilePage from './Profile/ProfilePage.jsx';
import {jwtDecode} from 'jwt-decode';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
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


  return (
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
    <Route path = '/profile/:email' element= {<ProfilePage token = {token} currentUserId = {currentUserId} /> } />
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
  );
}

export default App;