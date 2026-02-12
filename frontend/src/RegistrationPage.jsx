import React, {useState} from 'react'; 
import api from './services/api'
import { useNavigate, Link } from 'react-router-dom'

function RegistrationPage() {
    
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password , setPassword] = useState('')
    const [name , setName] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false);
    
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
    const handleOpenPassword = (e) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  }
    return (
         <> 
The first server launch may take some time.
      <div className="auth-page" >
    <form className="auth-form" onSubmit={handleRegistr}>
      <h1>Registration</h1>  
        <label htmlFor= "login-email"></label>
          <input value = {email} placeholder='email' onChange={(event)=>setEmail(event.target.value)} />
        <input value = {name} placeholder='name' onChange={(event)=>setName(event.target.value)} />
        <div className="input-group">
        <label htmlFor= "login-password"></label>
          <div className="password-wrapper">
          <input value = {password} placeholder='password' type={passwordVisible ? 'text': 'password'} onChange={(event)=>setPassword(event.target.value)} />
          <button className="hide-toggle-btn" type="button" onClick={handleOpenPassword}>{passwordVisible ? 'Show' : 'Hide'}</button>
          </div></div>
          <button type = 'submit'>Submit</button>
          <Link className = 'alternative-button' to='/Login'>I have an account</Link>
    </form>
    </div>
    </>
    );
}

export default RegistrationPage;