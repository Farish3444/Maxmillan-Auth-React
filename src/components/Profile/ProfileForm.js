import classes from './ProfileForm.module.css';
import React,{useContext,useRef,useState} from 'react';
import AuthContext from '../../store/auth-context';

const ProfileForm = () => {

  
  const newPasswordInputRef = useRef();
  const passwordChangeApi = 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBfjpJppz9_tGlG3OwXgBPEqzSwOKJm968';
  
  const AuthCxt = useContext(AuthContext);

  
  const submitHandler =(e)=>{
    e.preventDefault();
    
    const enteredPassword = newPasswordInputRef.current.value;
      fetch(passwordChangeApi,{
          method:'POST',
          body:JSON.stringify({
             idToken:AuthCxt.token,
             password:enteredPassword,
             returnSecureToken:false 
          }),
          headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer abc'
          }
        }).then(res =>{
          console.log('success changed password')
          console.log(enteredPassword)
        })

  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' minLength='7' id='new-password' />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
