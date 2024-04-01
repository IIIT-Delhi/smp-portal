import React, { useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "../../components/style.css";
import jwt_decode from "jwt-decode";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
// import { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const { login, userDetails } = useAuth();
  const [validuser, setvaliduser] = useState(null);
  // const [userObject, setUserObject] = useState(null);
  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const currRole = params.get("role");

  // const [showTimer, setShowTimer] = useState(false);
  const [timer, setTimer] = useState(3);

  // setvaliduser(null)

  function handleFaliure(result) {
    // alert(result)
    console.log("Login Failed");
  }

  function handleLogin(result) {
    var decoded = jwt_decode(result.credential);
    // console.log("Login Succesful");
    // console.log(decoded);

    const userObject = {
      role: currRole,
      email: decoded.email,
          };
    // setUserObject(userObjectTemp);
    login(userObject);
  }

  useEffect(() => {
    if (userDetails) {
      const id = userDetails.id;
      if (id === -2) {
        setvaliduser(false);
        const interval = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        setTimeout(() => {
          clearInterval(interval);
          navigate("/login"); // Redirect to login page
        }, 3000); // Wait for 3 seconds before redirecting
      }else if (id === -1) {
        // console.log(id);
        if (currRole === "admin" || currRole === "mentee") {
          // Show "Invalid User" message and redirect to the login page
          setvaliduser(false);
          const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
          }, 1000);

          setTimeout(() => {
            clearInterval(interval);
            navigate("/login"); // Redirect to login page
          }, 3000); // Wait for 3 seconds before redirecting
        } else if (currRole === "mentor") {
          // Redirect to RegistrationForm.js
          navigate("/registration");
        }
      } else {
        // console.log(id);
        // console.log(userDetails.status)
        setvaliduser(true);
        if (currRole === "mentor") {
          const status = userDetails.status;
          // console.log(status);
          if (status === 1 || status === 2 || status === 3 || status === 4) {
            // Redirect to RegistrationForm.js
            navigate("/registration");
          } else if (status === 5) {
            // Redirect to the profile based on the role
            navigate(`/users/${currRole}/profile`);
          }
        } else {
          // Redirect to the profile based on the role
          navigate(`/users/${currRole}/profile`);
        }
      }
    }
  }, [userDetails]);

  // useEffect(() => {
  //     if (userDetails) {
  //       navigate(/users/${userDetails.role}/profile);
  //     }

  //     if (validuser === false) {
  //       const interval = setInterval(() => {
  //         setTimer(prevTimer => prevTimer - 1);
  //       }, 1000);

  //       setTimeout(() => {
  //           clearInterval(interval);
  //           navigate('/login'); // Redirect to login page
  //       }, 3000); // Wait for 3 seconds before redirecting
  //     }

  //     if(isNewMentor === true){
  //       navigate('/registration');
  //     }

  // }, [userDetails, navigate, validuser,isNewMentor]);

  return (
    <div className="Login-Button">
      {validuser === null && (
        <GoogleOAuthProvider clientId="768207836010-qau8258pg290qg54havis7u8srfp9b1l.apps.googleusercontent.com">
          <div>
            <GoogleLogin
              // buttonText='Login with Google'
              onSuccess={handleLogin}
              onFailure={handleFaliure}
              cookiePolicy={"single_host_origin"}
            />
            {/* <span>Login as Admin</span> */}
          </div>
        </GoogleOAuthProvider>
      )}
      {validuser === false && (
        <div>
          <p>Unauthorized user. Redirecting in {timer} seconds...</p>
        </div>
      )}
    </div>
  );
};

export default Login;
