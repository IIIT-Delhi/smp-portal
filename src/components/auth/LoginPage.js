import React from "react";
import AuthButton from "./AuthButton";
import bgImage from "../../images/iiitdrndblock2.jpeg";
import iiitdLogo from "../../images/iiitd_logo_colour.png";

const LoginPage = () => {
  return (
    <div className="login-page">
      {/* Background with overlay */}
      <div 
        className="login-background"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -2
        }}
      />
      <div 
        className="login-overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, rgba(0, 50, 98, 0.85) 0%, rgba(0, 85, 164, 0.75) 100%)",
          zIndex: -1
        }}
      />

      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
        <div className="row w-100 max-w-6xl mx-auto">
          {/* Left Column - Branding & Info */}
          <div className="col-lg-7 col-md-6 d-flex flex-column justify-content-center text-white px-5">
            <div className="fade-in">
              {/* IIIT-D Logo */}
              <div className="mb-4">
                <img 
                  src={iiitdLogo} 
                  alt="IIIT Delhi Logo" 
                  style={{ height: "80px", width: "auto" }}
                  className="mb-3"
                />
              </div>

              {/* Main Heading */}
              <h1 className="display-4 fw-bold mb-4" style={{ color: "white", lineHeight: "1.2" }}>
                Student Mentorship Portal
              </h1>
              
              {/* Subtitle */}
              <h2 className="h4 mb-4 opacity-90" style={{ color: "white", fontWeight: "400" }}>
                Connecting Mentors and Mentees at IIIT Delhi
              </h2>

              {/* Description */}
              <p className="lead mb-4 opacity-85" style={{ color: "white", fontSize: "1.1rem", lineHeight: "1.6" }}>
                The Student Mentorship Program (SMP) enables constructive and positive interaction, 
                guidance and mentorship of junior students by senior students. Our platform facilitates 
                meaningful connections that support academic and personal development within the IIIT Delhi community.
              </p>

              {/* Key Features */}
              <div className="row mt-5">
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <div 
                      className="feature-icon me-3"
                      style={{
                        width: "48px",
                        height: "48px",
                        background: "rgba(255, 111, 0, 0.2)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <span style={{ color: "#FF6F00", fontSize: "1.5rem" }}>👥</span>
                    </div>
                    <div>
                      <h6 className="mb-1" style={{ color: "white" }}>Personalized Matching</h6>
                      <small className="opacity-75" style={{ color: "white" }}>Smart mentor-mentee pairing</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <div 
                      className="feature-icon me-3"
                      style={{
                        width: "48px",
                        height: "48px",
                        background: "rgba(255, 111, 0, 0.2)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <span style={{ color: "#FF6F00", fontSize: "1.5rem" }}>📅</span>
                    </div>
                    <div>
                      <h6 className="mb-1" style={{ color: "white" }}>Meeting Management</h6>
                      <small className="opacity-75" style={{ color: "white" }}>Schedule and track sessions</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <div 
                      className="feature-icon me-3"
                      style={{
                        width: "48px",
                        height: "48px",
                        background: "rgba(255, 111, 0, 0.2)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <span style={{ color: "#FF6F00", fontSize: "1.5rem" }}>📊</span>
                    </div>
                    <div>
                      <h6 className="mb-1" style={{ color: "white" }}>Progress Tracking</h6>
                      <small className="opacity-75" style={{ color: "white" }}>Monitor growth and feedback</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <div 
                      className="feature-icon me-3"
                      style={{
                        width: "48px",
                        height: "48px",
                        background: "rgba(255, 111, 0, 0.2)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <span style={{ color: "#FF6F00", fontSize: "1.5rem" }}>🏛️</span>
                    </div>
                    <div>
                      <h6 className="mb-1" style={{ color: "white" }}>Academic Support</h6>
                      <small className="opacity-75" style={{ color: "white" }}>Institution-backed guidance</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="col-lg-5 col-md-6 d-flex align-items-center justify-content-center">
            <div className="w-100" style={{ maxWidth: "400px" }}>
              <div 
                className="login-card slide-up"
                style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  padding: "2.5rem",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)"
                }}
              >
                <div className="text-center mb-4">
                  <h3 className="h4 mb-2" style={{ color: "var(--primary-dark-blue)" }}>
                    Welcome Back
                  </h3>
                  <p className="text-muted mb-0">
                    Sign in to access your mentorship portal
                  </p>
                </div>

                <AuthButton />

                <div className="mt-4 pt-4 border-top text-center">
                  <small className="text-muted">
                    Secure authentication powered by Google
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
