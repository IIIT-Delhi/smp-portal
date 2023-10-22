import React from "react";
import AuthButton from "../components/auth/AuthButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import the AuthContext

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from the AuthContext

  const handleLogin = (userDetails) => {
    // Assuming userDetails include role and email
    // Redirect to the role-specific dashboard with the updated userDetails
    navigate(`/dashboard/${userDetails}/profile`);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <h2>Login Page</h2>
        <AuthButton onLogin={handleLogin} />
      </div>
    </div>
  );
};

export default LoginPage;
