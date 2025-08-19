import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import iiitdLogo from "../../images/iiitd_logo_colour.png";

const Navbar = () => {
  const { userDetails, logout } = useAuth();
  const navigate = useNavigate();
  const role = userDetails?.role;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      logout();
      navigate("/login");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{
      backgroundColor: "var(--white)",
      borderBottom: "1px solid var(--border-light)",
      boxShadow: "0 2px 8px var(--shadow-light)",
      padding: "0.75rem 0",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      <div className="container">
        {/* Brand */}
        <NavLink to={`/users/${role}/profile`} className="navbar-brand d-flex align-items-center">
          <img 
            src={iiitdLogo} 
            alt="IIIT Delhi Logo" 
            style={{ 
              height: "45px", 
              width: "auto",
              marginRight: "12px"
            }}
          />
          <span style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            color: "var(--primary-dark-blue)",
            display: window.innerWidth > 768 ? "inline" : "none"
          }}>
            SMP Portal
          </span>
        </NavLink>

        {/* Mobile menu toggle */}
        <button 
          className="navbar-toggler d-lg-none"
          type="button"
          onClick={toggleMenu}
          style={{
            border: "none",
            background: "none",
            padding: "0.5rem",
            borderRadius: "8px"
          }}
        >
          <span style={{
            display: "block",
            width: "25px",
            height: "3px",
            backgroundColor: "var(--primary-dark-blue)",
            margin: "3px 0",
            borderRadius: "2px",
            transition: "0.3s"
          }}></span>
          <span style={{
            display: "block",
            width: "25px",
            height: "3px",
            backgroundColor: "var(--primary-dark-blue)",
            margin: "3px 0",
            borderRadius: "2px",
            transition: "0.3s"
          }}></span>
          <span style={{
            display: "block",
            width: "25px",
            height: "3px",
            backgroundColor: "var(--primary-dark-blue)",
            margin: "3px 0",
            borderRadius: "2px",
            transition: "0.3s"
          }}></span>
        </button>

        {/* Navigation Links */}
        <div className={`navbar-collapse ${isMenuOpen ? 'show' : 'collapse'}`}>
          <ul className="navbar-nav ms-auto d-flex align-items-center gap-2">
            {userDetails?.id !== -1 &&
              ((role === "mentor" && userDetails?.status === 5) ||
                role === "admin" ||
                role === "mentee") && (
                <>
                  {/* Profile Link */}
                  <li className="nav-item">
                    <NavLink
                      to={`/users/${role}/profile`}
                      className="nav-link"
                      style={{
                        color: "var(--text-primary)",
                        textDecoration: "none",
                        fontWeight: "500",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        transition: "all 0.3s ease",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "rgba(0, 85, 164, 0.05)";
                        e.target.style.color = "var(--accent-blue)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.color = "var(--text-primary)";
                      }}
                    >
                      <span>👤</span>
                      Profile
                    </NavLink>
                  </li>

                  {/* Meetings Link */}
                  <li className="nav-item">
                    <NavLink
                      to={`/users/${role}/Meetings`}
                      className="nav-link"
                      style={{
                        color: "var(--text-primary)",
                        textDecoration: "none",
                        fontWeight: "500",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        transition: "all 0.3s ease",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "rgba(0, 85, 164, 0.05)";
                        e.target.style.color = "var(--accent-blue)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.color = "var(--text-primary)";
                      }}
                    >
                      <span>📅</span>
                      Meetings
                    </NavLink>
                  </li>
                </>
              )}

            {/* Role-specific navigation */}
            {role === "mentee" && (
              <li className="nav-item">
                <NavLink
                  to={`/users/${role}/form`}
                  className="nav-link"
                  style={{
                    color: "var(--text-primary)",
                    textDecoration: "none",
                    fontWeight: "500",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(0, 85, 164, 0.05)";
                    e.target.style.color = "var(--accent-blue)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "var(--text-primary)";
                  }}
                >
                  <span>📝</span>
                  Feedback
                </NavLink>
              </li>
            )}

            {role === "admin" && (
              <>
                <li className="nav-item">
                  <NavLink
                    to={`/users/${role}/mentors`}
                    className="nav-link"
                    style={{
                      color: "var(--text-primary)",
                      textDecoration: "none",
                      fontWeight: "500",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      transition: "all 0.3s ease",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "rgba(0, 85, 164, 0.05)";
                      e.target.style.color = "var(--accent-blue)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "var(--text-primary)";
                    }}
                  >
                    <span>🎓</span>
                    Mentors
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to={`/users/${role}/mentees`}
                    className="nav-link"
                    style={{
                      color: "var(--text-primary)",
                      textDecoration: "none",
                      fontWeight: "500",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      transition: "all 0.3s ease",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "rgba(0, 85, 164, 0.05)";
                      e.target.style.color = "var(--accent-blue)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "var(--text-primary)";
                    }}
                  >
                    <span>👩‍🎓</span>
                    Mentees
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to={`/users/${role}/form`}
                    className="nav-link"
                    style={{
                      color: "var(--text-primary)",
                      textDecoration: "none",
                      fontWeight: "500",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      transition: "all 0.3s ease",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "rgba(0, 85, 164, 0.05)";
                      e.target.style.color = "var(--accent-blue)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "var(--text-primary)";
                    }}
                  >
                    <span>📋</span>
                    Forms
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to={`/users/${role}/form-management`}
                    className="nav-link"
                    style={{
                      color: "var(--text-primary)",
                      textDecoration: "none",
                      fontWeight: "500",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      transition: "all 0.3s ease",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "rgba(0, 85, 164, 0.05)";
                      e.target.style.color = "var(--accent-blue)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "var(--text-primary)";
                    }}
                  >
                    <span>⚙️</span>
                    Manage
                  </NavLink>
                </li>
              </>
            )}

            {/* User Profile & Logout */}
            {role && (
              <li className="nav-item dropdown">
                <div className="d-flex align-items-center gap-3 ms-3">
                  {/* User Avatar */}
                  <div 
                    className="user-avatar"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "var(--accent-blue)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "0.875rem",
                      border: "2px solid var(--border-light)",
                      cursor: "pointer"
                    }}
                    title={userDetails?.name || userDetails?.email}
                  >
                    {userDetails?.name ? userDetails.name.charAt(0).toUpperCase() : 
                     userDetails?.email ? userDetails.email.charAt(0).toUpperCase() : '?'}
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid var(--accent-blue)",
                      color: "var(--accent-blue)",
                      padding: "6px 16px",
                      borderRadius: "8px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "var(--accent-blue)";
                      e.target.style.color = "white";
                      e.target.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "var(--accent-blue)";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    <span>🚪</span>
                    Logout
                  </button>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
