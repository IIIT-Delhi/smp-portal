import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import iiitdLogo from "../../images/iiitd_logo_colour.png";
import "./Navbar.css";

const Navbar = () => {
  const { userDetails, logout } = useAuth();
  const navigate = useNavigate();
  const role = userDetails?.role;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const menuRef = useRef();

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Menu items based on role
  const getMenuItems = () => {
    const baseItems = [
      { to: `/users/${role}/profile`, icon: "👤", label: "Profile" },
      { to: `/users/${role}/Meetings`, icon: "📅", label: "Meetings" }
    ];

    if (role === "mentee") {
      baseItems.push({ to: `/users/${role}/form`, icon: "📝", label: "Feedback" });
    }

    if (role === "admin") {
      baseItems.push(
        { to: `/users/${role}/mentors`, icon: "🎓", label: "Mentors" },
        { to: `/users/${role}/mentees`, icon: "👩‍🎓", label: "Mentees" },
        { to: `/users/${role}/form`, icon: "📋", label: "Forms" },
        { to: `/users/${role}/form-management`, icon: "⚙️", label: "Manage" }
      );
    }

    return baseItems;
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      {isMobile && !isMenuOpen && (
        <button
          className="mobile-menu-toggle"
          onClick={toggleMenu}
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            zIndex: 1001,
            background: "var(--primary-dark-blue)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)"
          }}
        >
          ☰
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMenuOpen && (
        <div
          className="sidebar-mobile-overlay active"
          onClick={closeMenu}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999
          }}
        />
      )}

      {/* Left Sidebar */}
      <div
        className={`sidebar ${isMobile && isMenuOpen ? 'mobile-open' : ''}`}
        onMouseEnter={() => !isMobile && setIsMenuOpen(true)}
        onMouseLeave={() => !isMobile && setIsMenuOpen(false)}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          width: (!isMobile && isMenuOpen) || (isMobile && isMenuOpen) ? "240px" : isMobile ? "0" : "70px",
          background: "linear-gradient(180deg, #003262 0%, #0055A4 100%)",
          boxShadow: "2px 0 15px rgba(0, 0, 0, 0.1)",
          transition: "width 0.3s ease, transform 0.3s ease",
          transform: isMobile && !isMenuOpen ? "translateX(-100%)" : "translateX(0)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Brand Section */}
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: isMenuOpen ? "space-between" : "center",
            gap: "12px",
            minHeight: "70px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {!isMenuOpen && (
              <span style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "white",
                whiteSpace: "nowrap",
                overflow: "hidden"
              }}>
                SMP
              </span>
            )}
            {isMenuOpen && (
              <span style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "white",
                whiteSpace: "nowrap",
                overflow: "hidden"
              }}>
                SMP Portal
              </span>
            )}
          </div>

          {/* Close button for mobile */}
          {isMobile && isMenuOpen && (
            <button
              onClick={closeMenu}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "1.5rem",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div style={{ flex: 1, padding: "1rem 0" }}>
          {userDetails?.id !== -1 &&
            ((role === "mentor" && userDetails?.status === 5) ||
              role === "admin" ||
              role === "mentee") && (
              <>
                {getMenuItems().map((item, index) => (
                  <NavLink
                    key={index}
                    to={item.to}
                    style={({ isActive }) => ({
                      display: "flex",
                      alignItems: "center",
                      justifyContent: isMenuOpen ? "flex-start" : "center",
                      gap: "12px",
                      padding: isMenuOpen ? "12px 16px" : "12px 8px",
                      margin: "4px 8px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      color: isActive ? "white" : "rgba(255, 255, 255, 0.8)",
                      backgroundColor: isActive ? "rgba(255, 255, 255, 0.15)" : "transparent",
                      fontWeight: isActive ? "600" : "500",
                      transition: "all 0.3s ease",
                      position: "relative",
                      minHeight: "48px",
                      borderLeft: isActive ? "3px solid white" : "3px solid transparent"
                    })}
                    onMouseEnter={(e) => {
                      if (!e.target.classList.contains('active')) {
                        e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                        e.target.style.color = "white";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!e.target.classList.contains('active')) {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.color = "rgba(255, 255, 255, 0.8)";
                      }
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.2rem",
                        flexShrink: 0,
                        width: "24px",
                        textAlign: "center"
                      }}
                    >
                      {item.icon}
                    </span>
                    {isMenuOpen && (
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                ))}
              </>
            )}
        </div>

        {/* User Section */}
        <div
          style={{
            padding: "1rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          {/* User Info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isMenuOpen ? "flex-start" : "center",
              gap: "12px",
              marginBottom: "12px",
              padding: isMenuOpen ? "8px" : "8px 0"
            }}
          >
            <div
              className="user-avatar"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "600",
                fontSize: "0.75rem",
                flexShrink: 0
              }}
              title={userDetails?.name || userDetails?.email}
            >
              {userDetails?.name ? userDetails.name.charAt(0).toUpperCase() :
                userDetails?.email ? userDetails.email.charAt(0).toUpperCase() : '?'}
            </div>
            {isMenuOpen && (
              <div style={{ overflow: "hidden" }}>
                <div
                  style={{
                    fontWeight: "600",
                    color: "white",
                    fontSize: "0.875rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {userDetails?.name || userDetails?.email?.split('@')[0]}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(255, 255, 255, 0.7)",
                    textTransform: "capitalize"
                  }}
                >
                  {role}
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              backgroundColor: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "rgba(255, 255, 255, 0.9)",
              padding: isMenuOpen ? "8px 12px" : "8px 4px",
              borderRadius: "6px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "0.875rem"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
              e.target.style.borderColor = "rgba(255, 255, 255, 0.5)";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
              e.target.style.color = "rgba(255, 255, 255, 0.9)";
            }}
          >
            <span>🚪</span>
            {isMenuOpen && "Logout"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
