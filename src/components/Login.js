import React from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './style.css'
import jwt_decode from "jwt-decode";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Login = () => {

    const {userDetails, login, logout } = useAuth();
    const navigate = useNavigate();

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const currrole = params.get('role');

    function handleFaliure(result){
        // alert(result)
        console.log("Login Failed")
    }

    function handleLogin(result){
        var decoded = jwt_decode(result.credential);
        console.log("Login Succesful")
        console.log(decoded)
        
        const userObject = {
            role: currrole,
            email: decoded.email,
          };
          
        login(userObject)
    }


    useEffect(() => {
        if (userDetails) {
          navigate(`/dashboard/${userDetails.role}/profile`);
        }
      }, [userDetails, navigate]);


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