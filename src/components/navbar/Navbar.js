import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import iiitdLogo from "../../images/iiitd_logo_colour.png";

const Navbar = () => {
  const { userDetails, logout } = useAuth();
  const role = userDetails?.role;
  const navStyle = {
    // backgroundColor: "#3fada8",
    backgroundColor: "white",
    padding: "0.5rem 1rem",
    display: "flex",
    justifyContent: "space-between", // Align items horizontally
    alignItems: "center", // Align items vertical
    borderBottom: "1px solid rgba(204, 204, 204, 0.5)",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", // Add shadow near the bottom border
  };

  const listStyle = {
    listStyle: "none",
    display: "flex",
    gap: "20px",
  };

  const linkStyle = {
    color: "black",
    fontWeight: 500,
    fontSize: 15,
    textDecoration: "none",
    position: "relative", // Add position relative to create space for the underline
    transition: "color 0.3s ease", // Add transition for smooth effect
    borderRadius: "10px",
    marginRight: "15px",
  };

  const underlineStyle = {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    height: "2px",
    backgroundColor: "#3fad88", // Green color for the underline
    transition: "transform 0.3s ease", // Add transition for smooth effect
    transformOrigin: "center", // Center the transform origin for smoother animation
    transform: "scaleX(0)", // Initially hide the underline
  };

  const handleMouseEnter = (e) => {
    const underline = e.target.querySelector(".underline");
    if (underline) underline.style.transform = "scaleX(1)";
  };

  const handleMouseLeave = (e) => {
    const underline = e.target.querySelector(".underline");
    if (underline) underline.style.transform = "scaleX(0)";
  };

  const activeLinkStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  };

  // const history = useHistory();
  const navigate = useNavigate();
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      logout();
      navigate("/login");
    }
  };

  return (
    <nav className="navbar navbar-expand navbar-dark" style={navStyle}>
      <img
        className="navbar-brand"
        src={iiitdLogo}
        alt="IIITD Logo"
        style={{ width: "250px", marginRight: "10px" }}
      />
      <ul className="navbar-nav ml-auto">
        {userDetails?.id !== -1 &&
          ((role === "mentor" && userDetails?.status === 5) ||
            role === "admin" ||
            role === "mentee") && (
            <>
              <li className="nav-item" style={listStyle}>
                <NavLink
                  to={`/users/${role}/profile`}
                  className="nav-link"
                  style={linkStyle}
                  activestyle={activeLinkStyle}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  PROFILE
                  <div className="underline" style={underlineStyle}></div>
                  <div className="underline" style={underlineStyle}></div>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to={`/users/${role}/Meetings`}
                  className="nav-link"
                  style={linkStyle}
                  activestyle={activeLinkStyle}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  MEETINGS
                  <div className="underline" style={underlineStyle}></div>
                  <div className="underline" style={underlineStyle}></div>
                </NavLink>
              </li>
            </>
          )}
        {role === "mentee" && (
          <>
            <li className="nav-item">
              <NavLink
                to={`/users/${role}/form`}
                className="nav-link"
                style={linkStyle}
                activestyle={activeLinkStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                FEEDBACK FORM
                <div className="underline" style={underlineStyle}></div>
              </NavLink>
            </li>
            {/* Add more mentee-specific tabs here */}
          </>
        )}
        {role === "mentor" && <>{/* Add more mentor-specific tabs here */}</>}
        {role === "admin" && (
          <>
            <li className="nav-item">
              <NavLink
                to={`/users/${role}/mentors`}
                className="nav-link"
                style={linkStyle}
                activestyle={activeLinkStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                MENTORS
                <div className="underline" style={underlineStyle}></div>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to={`/users/${role}/mentees`}
                className="nav-link"
                style={linkStyle}
                activestyle={activeLinkStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                MENTEES
                <div className="underline" style={underlineStyle}></div>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to={`/users/${role}/form`}
                className="nav-link"
                style={linkStyle}
                activestyle={activeLinkStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                FORMS
                <div className="underline" style={underlineStyle}></div>
              </NavLink>
            </li>
            {/* Add more admin-specific tabs here */}
          </>
        )}
        {role && (
          <li
            className="nav-item"
            style={linkStyle}
            activestyle={activeLinkStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="btn btn-link nav-link"
              style={{ color: "black", textDecoration: "none" }}
              onClick={handleLogout}
            >
              LOGOUT
              <div className="underline" style={underlineStyle}></div>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
