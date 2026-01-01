import React, {useState} from 'react'; 
import {useNavigate} from 'react-router-dom'
import {api} from '../services/api'

function RegistrationPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password , setPassword] = useState('')
    const handleLogin = async (event) =>{
      event.preventDefault();
      try{
      const data = await api.registration(email, password)
        alert('registration successful')
        navigate('/login')
  } catch(e) {
    console.error(e)
    alert('fail login')
  }
      console.log("Попытка входа с такими данными:", {email: email , password : password})
      alert(`Вы пытаетесь войти с email: ${email}`)
    }
    return (
      <div className="auth-page" >
    <form className="auth-form" onSubmit={handleLogin}>
   
      <h1>Registration</h1>
        <label htmlFor= "login-email"></label>
          <input value = {email} placeholder='email' onChange={(event)=>setEmail(event.target.value)} />
        <label htmlFor= "login-password"></label>
          <input value = {password} placeholder='password' onChange={(event)=>setPassword(event.target.value)} />
          <button type = 'submit'>Submit</button>
  
    </form>
    </div>
    );
}

export default RegistrationPage;