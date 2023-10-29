import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import iiitdLogo from '../../../images/iiitd_logo.png';

const Navbar = () => {
  const { userDetails } = useAuth();
  const role = userDetails?.role;
  const navStyle = {
    backgroundColor: "#3fada8",
    padding: "0.5rem 1rem",
    height: "50px",
    display: "flex",
    justifyContent: "space-between", // Align items horizontally
    alignItems: "center", // Align items vertically
  };

  const listStyle = {
    listStyle: "none",
    display: "flex",
    gap: "20px",
  };

  return (
    <nav className="navbar navbar-expand navbar-dark" style={navStyle}>
      <img
        className="navbar-brand"
        src={iiitdLogo}
        alt="IIITD Logo"
        style={{ height: "60px", marginRight: "10px" }}
      />
      <ul className="navbar-nav ml-autp">
        <li className="nav-item" style={listStyle}>
          <Link
            to={`/dashboard/${role}/profile`}
            className="nav-link"
            style={{ color: "white" }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "rgba(255, 255, 255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to={`/dashboard/${role}/meetings`}
            className="nav-link"
            style={{ color: "white" }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "rgba(255, 255, 255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            Meetings
          </Link>
        </li>
        {role === "mentee" && (
          <>
            <li className="nav-item">
              <Link
                to={`/dashboard/${role}/form`}
                className="nav-link"
                style={{ color: "white" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "rgba(255, 255, 255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                Form and Responses
              </Link>
            </li>
            {/* Add more mentee-specific tabs here */}
          </>
        )}
        {role === "mentor" && <>{/* Add more mentor-specific tabs here */}</>}
        {role === "admin" && (
          <>
            <li className="nav-item">
              <Link
                to={`/dashboard/${role}/mentors`}
                className="nav-link"
                style={{ color: "white" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "rgba(255, 255, 255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                Mentors
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to={`/dashboard/${role}/mentees`}
                className="nav-link"
                style={{ color: "white" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "rgba(255, 255, 255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                Mentees
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to={`/dashboard/${role}/form`}
                className="nav-link"
                style={{ color: "white" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "rgba(255, 255, 255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                Form and Responses
              </Link>
            </li>
            {/* Add more admin-specific tabs here */}
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
