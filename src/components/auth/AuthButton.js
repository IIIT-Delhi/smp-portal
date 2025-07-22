import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const AuthButton = () => {
  const { userDetails, logout } = useAuth();
  const navigate = useNavigate();
  const [enrollmentFormStatus, setEnrollmentFormStatus] = useState([]);



  const handleGoogleLogin = (role) => {
    navigate(`/google-login?role=${role}`);
  };


  useEffect(() => {
    // setConsentFormStatus(userDetails.f2);
    // setEnrollmentFormStatus(userDetails.f1); 
    const fetchFormStatus = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/getFormStatus/"
        );
        const filteredEnrollmentFormStatus = response.data.filter(
          (status) => status.formId === "1"
        );

        if (filteredEnrollmentFormStatus.length > 0) {
          setEnrollmentFormStatus(filteredEnrollmentFormStatus[0]["formStatus"]);
        } else {
          // Handle case when no matching form status is found
          console.error("No matching form status found");
        }
      } catch (error) {
        console.error("Error fetching form status:", error);
      }
    }
  }, []);

  return (
    <div>
      {userDetails ? (
        <div>
          <div className="my-1">
            <button
              className="btn btn-outline-light"
              data-mdb-ripple-color="light"
              style={{ width: "100%", fontSize: "1.2em", borderWidth: "1.5px" }}
              onClick={() => handleGoogleLogin(userDetails.role)}
            >
              Go To Profile
            </button>
          </div>
          <div className="my-1">
            <button
              className="btn btn-outline-light"
              data-mdb-ripple-color="light"
              style={{ width: "100%", fontSize: "1.2em", borderWidth: "1.5px" }}
              onClick={() => logout()}
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="btn3 my-3">
            <button
              className="btn btn-outline-light"
              data-mdb-ripple-color="light"
              style={{ width: "100%", fontSize: "1.5vw", borderWidth: "1.5px" }}
              onClick={() => handleGoogleLogin("admin")}
            >
              Login as Admin
            </button>
          </div>
          <div className="btn1 my-3">
            <button
              className="btn btn-outline-light"
              data-mdb-ripple-color="light"
              style={{ width: "100%", fontSize: "1.5vw", borderWidth: "1.5px" }}
              onClick={() => handleGoogleLogin("mentee")}
            >
              Login as Mentee
            </button>
          </div>
          <div className="btn2 my-1">
            <button
              className="btn btn-outline-light"
              data-mdb-ripple-color="light"
              style={{ width: "100%", fontSize: "1.5vw", borderWidth: "1.5px" }}
              onClick={() => handleGoogleLogin("mentor")}
            >
              {enrollmentFormStatus == 1 ? "Apply for Mentor": "Login as Mentor"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthButton;
