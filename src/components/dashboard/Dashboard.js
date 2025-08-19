import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import { useAuth } from "../../context/AuthContext";
import Table from "../Table";
import { DashboardCard, Loading, Card } from "../ui";
import axios from "axios";
import deparmentOptions from "../../data/departmentOptions.json";

const Dashboard = () => {
  const { userDetails } = useAuth();
  const [userData, setUserData] = useState(null);
  const [assignedMentees, setAssignedMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const schema = {
    id: "",
    name: "",
    email: "",
    contact: "",
    department: "",
  };

  const fetchAttributeId = async (id) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/getMentorById/",
        JSON.stringify({ id: id })
      );

      let userData;

      if (typeof response.data === "string") {
        const dataObject = JSON.parse(response.data);
        userData = dataObject;
      } else if (typeof response.data === "object") {
        userData = response.data;
      }

      if (userData) {
        return userData;
      } else {
        console.error("User ID not found in response data");
        return null;
      }
    } catch (error) {
      console.error("Error fetching attribute:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      if (userDetails.role === "mentor") {
        try {
          const userDataTemp = await fetchAttributeId(userDetails.id);

          if (userDataTemp) {
            setUserData(userDataTemp);

            const menteeDetails = userDataTemp.menteesToMentors;

            if (menteeDetails.length > 0) {
              const menteeRows = menteeDetails.map((mentee) => {
                const [id, name, email, contact, department] = mentee;

                return (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{email}</td>
                    <td>{contact}</td>
                    <td>{deparmentOptions[department]}</td>
                  </tr>
                );
              });

              setAssignedMentees(menteeRows);
            }
          } else {
            console.error("Mentor not found for email:", userDetails.email);
          }
        } catch (error) {
          console.error("Error fetching mentor data:", error);
        }
      } else if (userDetails.role === "admin") {
        setUserData(userDetails);
      } else {
        setUserData(userDetails);
      }
      
      setLoading(false);
    };

    loadData();
  }, [userDetails]); // Added userDetails as dependency

  // Dashboard stats for different roles
  const getDashboardStats = () => {
    switch (userDetails.role) {
      case "mentor":
        return [
          {
            title: "Assigned Mentees",
            value: userData?.menteesToMentors?.length || 0,
            icon: "👩‍🎓",
            color: "var(--accent-blue)"
          },
          {
            title: "Total Meetings",
            value: "12", // This should come from API
            icon: "📅",
            color: "var(--orange-highlight)"
          },
          {
            title: "This Month",
            value: "3", // This should come from API
            icon: "📊",
            color: "var(--success)"
          }
        ];
      case "mentee":
        return [
          {
            title: "Mentor Assigned",
            value: userData?.mentorId !== "NULL" ? "Yes" : "No",
            icon: "🎓",
            color: userData?.mentorId !== "NULL" ? "var(--success)" : "var(--warning)"
          },
          {
            title: "Meetings Attended",
            value: "8", // This should come from API
            icon: "✅",
            color: "var(--accent-blue)"
          },
          {
            title: "Feedback Forms",
            value: "2", // This should come from API
            icon: "📝",
            color: "var(--orange-highlight)"
          }
        ];
      case "admin":
        return [
          {
            title: "Total Mentors",
            value: "45", // This should come from API
            icon: "🎓",
            color: "var(--accent-blue)"
          },
          {
            title: "Total Mentees",
            value: "120", // This should come from API
            icon: "👩‍🎓",
            color: "var(--orange-highlight)"
          },
          {
            title: "Active Pairs",
            value: "38", // This should come from API
            icon: "👥",
            color: "var(--success)"
          },
          {
            title: "This Week Meetings",
            value: "15", // This should come from API
            icon: "📅",
            color: "var(--primary-dark-blue)"
          }
        ];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <Loading 
          fullScreen 
          text="Loading your dashboard..." 
          size="lg"
        />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--light-gray)", minHeight: "100vh" }}>
      <Navbar />
      
      <div className="container py-4">
        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h1 className="h2 mb-1" style={{ color: "var(--primary-dark-blue)" }}>
                  Welcome back, {userData?.name || userDetails?.email?.split('@')[0]}!
                </h1>
                <p className="text-muted mb-0">
                  {userDetails.role === "mentor" && "Manage your mentees and track your mentoring journey"}
                  {userDetails.role === "mentee" && "View your mentor details and upcoming meetings"}
                  {userDetails.role === "admin" && "Oversee the Student Mentorship Program"}
                </p>
              </div>
              <div className="text-end">
                <span className="badge" style={{
                  backgroundColor: "rgba(0, 85, 164, 0.1)",
                  color: "var(--accent-blue)",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "0.875rem",
                  fontWeight: "500"
                }}>
                  {userDetails.role.charAt(0).toUpperCase() + userDetails.role.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Stats Cards */}
        <div className="row mb-4">
          {getDashboardStats().map((stat, index) => (
            <div key={index} className="col-lg-3 col-md-6 mb-3">
              <DashboardCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
              />
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="row">
          {/* Profile Information */}
          <div className="col-lg-8 mb-4">
            <Card headerTitle="Profile Information" headerColor="primary">
              <div className="card-body p-0">
                <div className="row g-0">
                  {/* Profile Image Section */}
                  <div className="col-md-4" style={{
                    background: "linear-gradient(135deg, var(--light-gray) 0%, #fafbfc 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem"
                  }}>
                    <div className="text-center">
                      <img
                        src={userData?.imgSrc || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || 'User')}&background=0055A4&color=fff&size=150`}
                        alt="Profile"
                        style={{
                          width: "120px",
                          height: "120px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "4px solid var(--white)",
                          boxShadow: "0 4px 20px var(--shadow-medium)"
                        }}
                      />
                      <h5 className="mt-3 mb-1" style={{ color: "var(--primary-dark-blue)" }}>
                        {userData?.name}
                      </h5>
                      <p className="text-muted small mb-0">IIIT Delhi</p>
                    </div>
                  </div>

                  {/* Profile Details Section */}
                  <div className="col-md-8">
                    <div className="p-4">
                      {userDetails.role !== "admin" && (
                        <div className="mb-3">
                          <div className="row">
                            <div className="col-sm-4">
                              <span className="text-muted small">Roll Number</span>
                            </div>
                            <div className="col-sm-8">
                              <span style={{ fontWeight: "500" }}>{userData?.id}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mb-3">
                        <div className="row">
                          <div className="col-sm-4">
                            <span className="text-muted small">Email</span>
                          </div>
                          <div className="col-sm-8">
                            <span style={{ fontWeight: "500" }}>{userData?.email}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="row">
                          <div className="col-sm-4">
                            <span className="text-muted small">
                              {userDetails.role === "admin" ? "Phone" : "Contact"}
                            </span>
                          </div>
                          <div className="col-sm-8">
                            <span style={{ fontWeight: "500" }}>
                              {userDetails.role === "admin" ? userData?.phone : userData?.contact}
                            </span>
                          </div>
                        </div>
                      </div>

                      {(userDetails.role === "mentor" || userDetails.role === "mentee") && (
                        <>
                          {userDetails.role === "mentor" && (
                            <>
                              <div className="mb-3">
                                <div className="row">
                                  <div className="col-sm-4">
                                    <span className="text-muted small">Year</span>
                                  </div>
                                  <div className="col-sm-8">
                                    <span style={{ fontWeight: "500" }}>{userData?.year?.[1]}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="mb-3">
                                <div className="row">
                                  <div className="col-sm-4">
                                    <span className="text-muted small">Programme</span>
                                  </div>
                                  <div className="col-sm-8">
                                    <span style={{ fontWeight: "500" }}>
                                      {userData?.department?.startsWith("B") ? "B.Tech" : "M.Tech"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                          
                          <div className="mb-3">
                            <div className="row">
                              <div className="col-sm-4">
                                <span className="text-muted small">Department</span>
                              </div>
                              <div className="col-sm-8">
                                <span style={{ fontWeight: "500" }}>
                                  {deparmentOptions[userData?.department]?.split(" ")[0]}
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {userDetails.role === "admin" && (
                        <>
                          <div className="mb-3">
                            <div className="row">
                              <div className="col-sm-4">
                                <span className="text-muted small">Department</span>
                              </div>
                              <div className="col-sm-8">
                                <span style={{ fontWeight: "500" }}>{userData?.department}</span>
                              </div>
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="row">
                              <div className="col-sm-4">
                                <span className="text-muted small">Address</span>
                              </div>
                              <div className="col-sm-8">
                                <span style={{ fontWeight: "500" }}>{userData?.address}</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="col-lg-4 mb-4">
            {userDetails.role === "mentee" && userData?.mentorId !== "NULL" && (
              <Card headerTitle="Your Mentor" headerColor="orange">
                <Card.Body className="text-center">
                  <img
                    src={userData?.mentorImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.mentorName || 'Mentor')}&background=FF6F00&color=fff&size=100`}
                    alt="Mentor Profile"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid var(--white)",
                      boxShadow: "0 4px 15px var(--shadow-medium)",
                      marginBottom: "1rem"
                    }}
                  />
                  <h6 className="mb-1" style={{ color: "var(--primary-dark-blue)" }}>
                    {userData?.mentorName}
                  </h6>
                  <p className="text-muted small mb-2">{userData?.mentorId}</p>
                  <p className="text-muted small mb-2">{userData?.mentorEmail}</p>
                  <p className="text-muted small mb-2">
                    {deparmentOptions[userData?.mentorDepartment]}
                  </p>
                  <p className="text-muted small mb-0">{userData?.mentorContact}</p>
                </Card.Body>
              </Card>
            )}

            {userDetails.role === "mentee" && userData?.mentorId === "NULL" && (
              <Card>
                <Card.Body className="text-center">
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
                  <h6 className="mb-2" style={{ color: "var(--warning)" }}>Mentor Not Assigned</h6>
                  <p className="text-muted small mb-0">
                    You will be assigned a mentor soon. Please check back later.
                  </p>
                </Card.Body>
              </Card>
            )}
          </div>
        </div>

        {/* Mentees Table for Mentors */}
        {userDetails.role === "mentor" && assignedMentees.length > 0 && (
          <div className="row">
            <div className="col-12">
              <Card headerTitle="Your Assigned Mentees" headerColor="success">
                <Card.Body padding="none">
                  <div style={{ overflowX: "auto" }}>
                    <Table
                      headers={Object.keys(schema)}
                      rows={assignedMentees}
                      searchable={true}
                    />
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
