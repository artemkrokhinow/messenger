import React, {useState} from 'react'; 
import { useNavigate, Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google';
import api from './services/api'



function LoginPage({setToken}) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password , setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false);
  const handleLogin = async (event) =>{
    event.preventDefault();
    setLoading(true)
    try{
    const data = await api.login(email, password)
    
    if (data.token){
      localStorage.setItem('token', data.token)
      setToken(data.token)
      alert('Вход успешен')
      navigate('/main')
      
    } else {
      alert('fail login')
    }

} catch(e) {
  console.error(e)
  alert('fail login')
}
finally {
  setLoading (false)
}
    console.log("Попытка входа с такими данными:", {email: email , password : password})
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const data = await api.googleLogin(credentialResponse.credential);
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        alert('Вход через Google успешен');
        navigate('/main');
      } else {
        alert('Google login failed');
      }
    } catch (e) {
      console.error(e);
      alert('Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPassword = (e) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  }
  return (
    <> 
The first server launch may take some time.
    <div className="auth-page" >
    <form className="auth-form" onSubmit={handleLogin}>
   
      <h1>Login</h1>
        <label htmlFor= "login-email"></label>
          <input value = {email} placeholder='email oder name' onChange={(event)=>setEmail(event.target.value)} />
          <div className="input-group">
        <label htmlFor= "login-password"></label>
          <div className="password-wrapper">
          <input value = {password} placeholder='password' type={passwordVisible ? 'text': 'password'} onChange={(event)=>setPassword(event.target.value)} />
          <button className="hide-toggle-btn" type="button" onClick={handleOpenPassword}>{passwordVisible ? 'Show' : 'Hide'}</button>
          </div></div>
          <button type = 'submit'>Submit</button>
          
          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.log('Login Failed');
                alert('Google login failed');
              }}
            />
          </div>

          <Link className = 'alternative-button' to='/Registration'>Dont have an account</Link>

    </form>
    {loading && <div className="loader">Loading...</div>}
    </div>
    </>
  );
}

export default LoginPage;