import React from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './style.css'
import jwt_decode from "jwt-decode";

const Login = () => {

    function handleFaliure(result){
        // alert(result)
        console.log("Login Failed")
    }

    function handleLogin(result){
        var decoded = jwt_decode(result.credential);
        console.log("Login Succesful")
        console.log(decoded)
    }


  return (
    <div className='Login-Button'>
        <GoogleOAuthProvider clientId="768207836010-qau8258pg290qg54havis7u8srfp9b1l.apps.googleusercontent.com">
            <GoogleLogin
                // buttonText='Login with Google'
                onSuccess={handleLogin}
                onFailure={handleFaliure}
                cookiePolicy={'single_host_origin'}
            />
        </GoogleOAuthProvider>
    </div>
  )
}

export default Login;