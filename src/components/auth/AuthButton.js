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
          console.error("No matching form status found");
        }
      } catch (error) {
        console.error("Error fetching form status:", error);
      }
    }
    fetchFormStatus();
  }, []);

  // Button styles for consistent design
  const buttonStyle = {
    width: "100%",
    padding: "12px 24px",
    borderRadius: "12px",
    border: "2px solid",
    fontSize: "1rem",
    fontWeight: "600",
    textTransform: "none",
    transition: "all 0.3s ease",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "16px",
    textDecoration: "none"
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#FF6F00",
    borderColor: "#FF6F00",
    color: "white",
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#0055A4",
    borderColor: "#0055A4",
    color: "white",
  };

  const outlineButtonStyle = {
    ...buttonStyle,
    backgroundColor: "transparent",
    borderColor: "#003262",
    color: "#003262",
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#f8f9fa",
    borderColor: "#e9ecef",
    color: "#6c757d",
    cursor: "not-allowed",
    opacity: 0.6
  };

  return (
    <div className="auth-buttons">
      {userDetails ? (
        <div>
          <button
            style={primaryButtonStyle}
            onClick={() => handleGoogleLogin(userDetails.role)}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#e55a00";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px rgba(255, 111, 0, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#FF6F00";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            <span>🏠</span>
            Go To Profile
          </button>

          <button
            style={outlineButtonStyle}
            onClick={() => logout()}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#003262";
              e.target.style.color = "white";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#003262";
              e.target.style.transform = "translateY(0)";
            }}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      ) : (
        <div className="role-selection">
          {/* Mentee Login */}
          <button
            style={secondaryButtonStyle}
            onClick={() => handleGoogleLogin("mentee")}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#004494";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px rgba(0, 85, 164, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#0055A4";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            <span>👩‍🎓</span>
            Mentee Login
          </button>

          {/* Mentor Login */}
          <button
            style={primaryButtonStyle}
            onClick={() => handleGoogleLogin("mentor")}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#e55a00";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px rgba(255, 111, 0, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#FF6F00";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            <span>🎓</span>
            {enrollmentFormStatus == 1 ? "Apply to be Mentor" : "Mentor Login"}
          </button>

          {/* Admin Login - Hidden as requested in original code */}
          <button
            style={disabledButtonStyle}
            onClick={() => handleGoogleLogin("admin")}
          >
            <span>🛠️</span>
            Login as Admin
          </button>

          {/* Info Text */}
          <div className="text-center mt-3">
            <small style={{ color: "#6c757d", fontSize: "0.875rem" }}>
              Choose your role to access the appropriate portal
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthButton;
