import { useState,useRef,useContext } from 'react';
import AuthContext from '../../store/auth-context';
import classes from './AuthForm.module.css';
import { useHistory } from 'react-router-dom';

const AuthForm = () => {
 const history = useHistory();
  const AuthCxt = useContext(AuthContext)

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const signInApi = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBfjpJppz9_tGlG3OwXgBPEqzSwOKJm968'
  const signUpApi = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBfjpJppz9_tGlG3OwXgBPEqzSwOKJm968'

  const submitHandler =(event)=>{

        event.preventDefault();
        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        let url;
        if(isLogin){
          url = signInApi
        }
        else{
          url = signUpApi
        }
          fetch(url,{
            method:"POST",
            body:JSON.stringify({
              email:enteredEmail,
              password:enteredPassword,
              returnSecureToken:true
            }),
            headers:{
              'Content-Type':"application/json"
            }
          }).then(res => {
            setIsLoading(false);
            if(res.ok){
                return (
                  res.json())
            }else{
              res.json().then((data)=>{
                console.log(data);
                const errorMessage = 'Authentication Failed';
                setErrorMsg(true)
                throw new Error(errorMessage)
              });
            }
          })
           .then((data)=>{
             const expirationTime = new Date((new Date().getTime() + (+data.expiresIn * 1000)));
             AuthCxt.login(data.idToken);
             history.replace('/');
           })
           .catch(err => alert(err.message));
}
 
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
        {errorMsg ? <p style={{color:'red'}}>Invalid password or Email Entered</p>:null}
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
         { !isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
         {isLoading && <p>Loading.....</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account..' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
