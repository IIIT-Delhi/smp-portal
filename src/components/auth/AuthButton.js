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
              style={{
                border: "1px solid white", // Add a white border
                backgroundColor: "transparent", // Set the initial background color to transparent
                transition: "background-color 0.2s", // Add a smooth transition effect
              }}
              onClick={() => {
                login({ role: "mentee" });
                onLogin("mentee");
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "rgba(255, 255, 255,0.1)")
              } // Change background on hover
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              } // Restore original background on hover out
            >
              Login as Mentee
            </button>
          </div>
          <div className="btn2 my-1">
            <button
              className="btn btn-primary"
              style={{
                border: "1px solid white", // Add a white border
                backgroundColor: "transparent", // Set the initial background color to transparent
                transition: "background-color 0.2s", // Add a smooth transition effect
              }}
              onClick={() => {
                login({ role: "mentor" });
                onLogin("mentor");
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "rgba(255, 255, 255,0.1)")
              } // Change background on hover
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              } // Restore original background on hover out
            >
              Login as Mentor
            </button>
          </div>
          <div className="btn3 my-3">
            <button
              className="btn btn-primary"
              style={{
                border: "1px solid white", // Add a white border
                backgroundColor: "transparent", // Set the initial background color to transparent
                transition: "background-color 0.2s", // Add a smooth transition effect
              }}
              onClick={() => {
                login({ role: "admin" });
                onLogin("admin");
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "rgba(255, 255, 255,0.1)")
              } // Change background on hover
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              } // Restore original background on hover out
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
