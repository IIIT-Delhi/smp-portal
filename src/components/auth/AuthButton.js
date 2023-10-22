import React from "react";
import { useAuth } from "../../context/AuthContext";

const AuthButton = ({onLogin}) => {
  const { user,userDetails, login, logout } = useAuth();

  return (
    <div>
      {user ? (
        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      ) : (
        <>
          <div className="btn1 my-3">
            <button
              className="btn btn-primary"
              onClick={() => {
                login({ role: "mentee" });
                onLogin("mentee");
              }}
            >
              Login as Mentee
            </button>
          </div>
          <div className="btn2 my-1">
            <button
              className="btn btn-primary"
              onClick={() => {
                login({ role: "mentor" });
                onLogin("mentor");
              }}
            >
              Login as Mentor
            </button>
          </div>
          <div className="btn3 my-3">
            <button
              className="btn btn-primary"
              onClick={() => {
                login({ role: "admin" });
                onLogin("admin");
              }}
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
