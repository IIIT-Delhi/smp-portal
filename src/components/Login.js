import React from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './style.css'
import jwt_decode from "jwt-decode";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

const Login = () => {

    const {userDetails, login, logout , validuser,setvaliduser} = useAuth();
    const navigate = useNavigate();

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const currrole = params.get('role');

    // const [showTimer, setShowTimer] = useState(false);
    const [timer, setTimer] = useState(3);

    // setvaliduser(null)

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
        return
    }


    useEffect(() => {
        if (userDetails) {
          navigate(`/dashboard/${userDetails.role}/profile`);
        }

        if (validuser === false) {
          const interval = setInterval(() => {
            setTimer(prevTimer => prevTimer - 1);
          }, 1000);

          setTimeout(() => {
              clearInterval(interval);
              navigate('/login'); // Redirect to login page
          }, 3000); // Wait for 3 seconds before redirecting
        }
    }, [userDetails, navigate, validuser]);


  return (
    <div className='Login-Button'>
        {validuser === null && 
          (<GoogleOAuthProvider clientId="768207836010-qau8258pg290qg54havis7u8srfp9b1l.apps.googleusercontent.com">
            <GoogleLogin
                // buttonText='Login with Google'
                onSuccess={handleLogin}
                onFailure={handleFaliure}
                cookiePolicy={'single_host_origin'}
            />
          </GoogleOAuthProvider>)}
        {validuser === false && (
          <div>
              <p>Unauthorized user. Redirecting in {timer} seconds...</p>
          </div>
        )}
    </div>
  )
}

export default Login;