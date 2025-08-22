import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import { useAuth } from "../../context/AuthContext";
import Table from "../Table";
import { DashboardCard, Loading, Card } from "../ui";
import InitialSetup from "../mentee/InitialSetup";
import axios from "axios";
import deparmentOptions from "../../data/departmentOptions.json";

const Dashboard = () => {
  const { userDetails, setUserDetails } = useAuth();
  const [userData, setUserData] = useState(null);
  const [assignedMentees, setAssignedMentees] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showInitialSetup, setShowInitialSetup] = useState(false);

  const schema = {
    id: "",
    name: "",
    email: "",
    contact: "",
    department: "",
  };

  // Fetch dashboard statistics based on role
  const fetchDashboardStats = async () => {
    try {
      switch (userDetails.role) {
        case "admin":
          try {
            const [mentorsRes, menteesRes, meetingsRes] = await Promise.all([
              axios.get("http://localhost:8000/api/getAllMentors/"),
              axios.get("http://localhost:8000/api/getAllMentees/"),
              axios.post("http://localhost:8000/api/getMeetings/", {
                role: "admin",
                id: userDetails.id
              })
            ]);

            const mentorsData = Array.isArray(mentorsRes.data) ? mentorsRes.data : JSON.parse(mentorsRes.data);
            const menteesData = Array.isArray(menteesRes.data) ? menteesRes.data : JSON.parse(menteesRes.data);
            const meetingsData = Array.isArray(meetingsRes.data) ? meetingsRes.data : JSON.parse(meetingsRes.data);

            // Count active pairs (mentees with assigned mentors)
            const activePairs = menteesData.filter(mentee => mentee.mentorId && mentee.mentorId !== "NULL").length;

            // Count this week's meetings
            const currentWeek = new Date();
            const weekStart = new Date(currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay()));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);

            // Handle both array of meetings and categorized meetings object
            let allMeetings = [];
            if (meetingsData.upcomingMeeting && meetingsData.previousMeeting) {
              allMeetings = [...meetingsData.upcomingMeeting, ...meetingsData.previousMeeting];
            } else if (Array.isArray(meetingsData)) {
              allMeetings = meetingsData;
            }

            const thisWeekMeetings = allMeetings.filter(meeting => {
              const meetingDate = new Date(meeting.date);
              return meetingDate >= weekStart && meetingDate <= weekEnd;
            }).length;

            setDashboardStats({
              totalMentors: mentorsData.length,
              totalMentees: menteesData.length,
              activePairs: activePairs,
              thisWeekMeetings: thisWeekMeetings
            });
          } catch (error) {
            console.error("Error fetching admin data:", error);
            setDashboardStats({
              totalMentors: 0,
              totalMentees: 0,
              activePairs: 0,
              thisWeekMeetings: 0
            });
          }
          break;

        case "mentee":
          // Fetch meetings for mentee
          const menteeId = userDetails.id;
          try {
            const [menteeMeetingsRes, feedbackRes] = await Promise.all([
              axios.post("http://localhost:8000/api/getMeetings/", {
                role: "mentee",
                id: menteeId
              }),
              axios.post("http://localhost:8000/api/checkFeedbackSubmission/", {
                id: menteeId
              })
            ]);

            const menteeMeetingsData = menteeMeetingsRes.data;

            // Handle both array of meetings and categorized meetings object
            let allMeetings = [];
            if (menteeMeetingsData.upcomingMeeting && menteeMeetingsData.previousMeeting) {
              allMeetings = [...menteeMeetingsData.upcomingMeeting, ...menteeMeetingsData.previousMeeting];
            } else if (Array.isArray(menteeMeetingsData)) {
              allMeetings = menteeMeetingsData;
            }

            // Count attended meetings (assuming past meetings are attended)
            const attendedMeetings = allMeetings.filter(meeting => new Date(meeting.date) < new Date()).length;

            // Get feedback forms count - check if feedback has been submitted
            const feedbackCount = feedbackRes.data.hasSubmitted ? 1 : 0;

            setDashboardStats({
              attendedMeetings: attendedMeetings,
              feedbackForms: feedbackCount
            });
          } catch (error) {
            console.error("Error fetching mentee data:", error);
            setDashboardStats({
              attendedMeetings: 0,
              feedbackForms: 0
            });
          }
          break;

        case "mentor":
          // Fetch mentor's mentees and meetings
          const mentorId = userDetails.id;
          try {
            const mentorMeetingsRes = await axios.post("http://localhost:8000/api/getMeetings/", {
              role: "mentor",
              id: mentorId
            });
            const mentorMeetingsData = mentorMeetingsRes.data;

            // Handle both array of meetings and categorized meetings object
            let allMeetings = [];
            if (mentorMeetingsData.upcomingMeeting && mentorMeetingsData.previousMeeting) {
              allMeetings = [...mentorMeetingsData.upcomingMeeting, ...mentorMeetingsData.previousMeeting];
            } else if (Array.isArray(mentorMeetingsData)) {
              allMeetings = mentorMeetingsData;
            }

            // Get assigned mentees count from the user data that should be fetched
            const assignedMenteesCount = assignedMentees.length;

            // Count upcoming meetings
            const upcomingMeetings = allMeetings.filter(meeting => new Date(meeting.date) > new Date()).length;

            setDashboardStats({
              assignedMentees: assignedMenteesCount,
              upcomingMeetings: upcomingMeetings,
              totalMeetings: allMeetings.length
            });
          } catch (error) {
            console.error("Error fetching mentor data:", error);
            setDashboardStats({
              assignedMentees: assignedMentees.length,
              upcomingMeetings: 0,
              totalMeetings: 0
            });
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Set default values on error
      setDashboardStats({});
    }
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

      // Check if mentee needs to complete initial setup
      if (userDetails.role === "mentee" && userDetails.id !== -1) {
        try {
          const response = await axios.post("http://localhost:8000/api/checkFirstLoginStatus/", {
            id: userDetails.id
          });

          if (!response.data.first_login_completed) {
            setShowInitialSetup(true);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error("Error checking first login status:", error);
        }
      }

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

      // Fetch dashboard statistics for all roles
      await fetchDashboardStats();

      setLoading(false);
    };

    loadData();
  }, [userDetails]); // Added userDetails as dependency

  // Dashboard stats for different roles
  const getDashboardData = () => {
    switch (userDetails.role) {
      case "mentor":
        return [
          {
            title: "Assigned Mentees",
            value: dashboardStats.assignedMentees || assignedMentees.length,
            icon: "�",
            color: "var(--accent-blue)"
          },
          {
            title: "Upcoming Meetings",
            value: dashboardStats.upcomingMeetings || "0",
            icon: "📅",
            color: "var(--orange-highlight)"
          },
          {
            title: "Total Meetings",
            value: dashboardStats.totalMeetings || "0",
            icon: "✅",
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
            value: dashboardStats.attendedMeetings || "0",
            icon: "✅",
            color: "var(--accent-blue)"
          },
          {
            title: "Feedback Forms",
            value: dashboardStats.feedbackForms || "0",
            icon: "📝",
            color: "var(--orange-highlight)"
          }
        ];
      case "admin":
        return [
          {
            title: "Total Mentors",
            value: dashboardStats.totalMentors || "0",
            icon: "🎓",
            color: "var(--accent-blue)"
          },
          {
            title: "Total Mentees",
            value: dashboardStats.totalMentees || "0",
            icon: "👩‍🎓",
            color: "var(--orange-highlight)"
          },
          {
            title: "Active Pairs",
            value: dashboardStats.activePairs || "0",
            icon: "👥",
            color: "var(--success)"
          },
          {
            title: "This Week Meetings",
            value: dashboardStats.thisWeekMeetings || "0",
            icon: "📅",
            color: "var(--primary-dark-blue)"
          }
        ];
      default:
        return [];
    }
  };

  const handleSetupComplete = () => {
    // Update userDetails to reflect completion
    const updatedUserDetails = {
      ...userDetails,
      first_login_completed: true
    };
    setUserDetails(updatedUserDetails);
    localStorage.setItem("userDetails", JSON.stringify(updatedUserDetails));
    setShowInitialSetup(false);
    // Reload the page data
    window.location.reload();
  };

  // Show initial setup modal for mentees who haven't completed it
  if (showInitialSetup && userDetails.role === "mentee") {
    return <InitialSetup userDetails={userDetails} onSetupComplete={handleSetupComplete} />;
  }

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

      <div
        className="container py-4"
        style={{
          marginLeft: "70px",
          paddingTop: "80px !important",
          transition: "margin-left 0.3s ease"
        }}
      >
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
        {/* <div className="row mb-4">
          {getDashboardData().map((stat, index) => (
            <div key={index} className="col-lg-3 col-md-6 mb-3">
              <DashboardCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
              />
            </div>
          ))}
        </div> */}

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
                      width: "50px",
                      height: "50px",
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
                <Card.Body className="text-center" style={{ minHeight: "305px" }}>
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
