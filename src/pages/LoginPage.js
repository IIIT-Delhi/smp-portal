import React from "react";
import AuthButton from "../components/auth/AuthButton";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext"; // Import the AuthContext
import bgImage from "../images/iiitdrndblock2.jpeg";
import { useAuth } from "../context/AuthContext";
// import Login from "../components/Login";

const LoginPage = () => {
  // const navigate = useNavigate();
  // const {setvaliduser , setisNewMentor} = useAuth();
  // const { login } = useAuth(); // Get the login function from the AuthContext

  // const handleLogin = (userDetails) => {
  //   // Assuming userDetails include role and email
  //   // Redirect to the role-specific dashboard with the updated userDetails
  //   navigate(`/dashboard/${userDetails}/profile`);
  // };
  // setvaliduser(null)
  // setisNewMentor(false)

  return (
    <div
      className="container d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        color: "white", 
      }}
    >
      <div
        className="text-center"
        style={{
          backgroundColor: "#3fada8",
          borderRadius: "25px",
          padding: "40px",
        }}
      >
        <h2>Login Page</h2>
        <AuthButton/>
      </div>
    </div>
  );
};

export default LoginPage;
