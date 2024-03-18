import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { useAuth,  } from '../../../context/AuthContext';
import iiitdLogo from '../../../images/iiitd_logo.png';
import { queryByRole } from '@testing-library/react';

const Navbar = () => {
  const { userDetails, logout } = useAuth();
  const role = userDetails?.role;
  const navStyle = {
    backgroundColor: "#3fada8",
    padding: "0.5rem 1rem",
    display: "flex",
    justifyContent: "space-between", // Align items horizontally
    alignItems: "center", // Align items vertical
  };

  const listStyle = {
    listStyle: "none",
    display: "flex",
    gap: "20px",
  };

  // const history = useHistory();
  const navigate = useNavigate();
  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar navbar-expand navbar-dark" style={navStyle}>
      <img
        className="navbar-brand"
        src={iiitdLogo}
        alt="IIITD Logo"
        style={{ width:"200px", marginRight: "10px" }}
      />
      <ul className="navbar-nav ml-auto">
        {userDetails?.id !== -1 &&
          ((role === "mentor" && userDetails?.status === 5) ||
            role === "admin" ||
            role === "mentee") && (
            <>
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
                  to={`/dashboard/${role}/Meetings`}
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
            </>
          )}
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
                Feedback Form
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
        {role && (
          <li className="nav-item">
            <button
              className="btn btn-link nav-link"
              style={{ color: "white", textDecoration: "none" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default  Navbar;