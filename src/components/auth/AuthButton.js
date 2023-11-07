import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AuthButton = () => {
  const {userDetails, logout } = useAuth();
  const navigate = useNavigate();
  

  const handleGoogleLogin = (role) => {
    navigate(`/google-login?role=${role}`);
  };


  return (
    <div>
      {userDetails ? (
        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      ) : (
        <>
          <div className="btn1 my-3">
            <button
              className="btn btn-outline-light"
              data-mdb-ripple-color="light"
              onClick={() => handleGoogleLogin('mentee')}
            >
              Login as Mentee
            </button>
          </div>
          <div className="btn2 my-1">
            <button
              className="btn btn-outline-light"
              data-mdb-ripple-color="light"
              onClick={() => handleGoogleLogin('mentor')}
            >
              Login as Mentor
            </button>
          </div>
          <div className="btn3 my-3">
            <button
              className="btn btn-outline-light"
              data-mdb-ripple-color="light"
              onClick={
                () => handleGoogleLogin('admin')
              }
            >
              Login as Admin
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthButton;
