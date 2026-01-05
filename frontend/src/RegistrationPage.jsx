import React, {useState} from 'react'; 
import {useNavigate} from 'react-router-dom'
import api from './services/api'

function RegistrationPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password , setPassword] = useState('')
    const [name , setName] = useState('')
    const handleRegistr = async (event) =>{
      event.preventDefault();
      try{
        await api.registration(email, password, name)
        alert('registration successful')
        navigate('/login')
  } catch(e) {
    console.error('Fail registration',e)
    alert('fail login')
  }
      console.log("Попытка входа с такими данными:", {email: email , password : password, name: name})
    }
    return (
      <div className="auth-page" >
    <form className="auth-form" onSubmit={handleRegistr}>
   
      <h1>Registration</h1>
        <label htmlFor= "login-email"></label>
          <input value = {email} placeholder='email' onChange={(event)=>setEmail(event.target.value)} />
        <input value = {name} placeholder='name' onChange={(event)=>setName(event.target.value)} />
        <label htmlFor= "login-password"></label>
          <input value = {password} placeholder='password' onChange={(event)=>setPassword(event.target.value)} />
          <button type = 'submit'>Submit</button>
          <a className = 'alternative-button'to ='/Login'>I have an account</a>
  
    </form>
    </div>
    );
}

export default RegistrationPage;