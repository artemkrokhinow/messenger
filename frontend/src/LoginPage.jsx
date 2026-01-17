import React, {useState} from 'react'; 
import { useNavigate, Link } from 'react-router-dom'
import api from './services/api'



function LoginPage({setToken}) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password , setPassword] = useState('')
  const handleLogin = async (event) =>{
    event.preventDefault();
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
    console.log("Попытка входа с такими данными:", {email: email , password : password})
    

  }
  return (
    <div className="auth-page" >
    <form className="auth-form" onSubmit={handleLogin}>
   
      <h1>Login</h1>
        <label htmlFor= "login-email"></label>
          <input value = {email} placeholder='email oder name' onChange={(event)=>setEmail(event.target.value)} />
        <label htmlFor= "login-password"></label>
          <input value = {password} placeholder='password' onChange={(event)=>setPassword(event.target.value)} />
          <button type = 'submit'>Submit</button>
          <a className = 'alternative-button' href='/Registration'>Dont have an account</a>
    </form>
    </div>
  );
}

export default LoginPage;