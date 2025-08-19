import React, { useState, useEffect, useCallback } from "react";
import axios from "axios"; // Import Axios
import Navbar from "../navbar/Navbar";
import { useAuth } from "../../context/AuthContext";
import SinlgeMeeting from "./SingleMeeting";
import ScheduleMeetingButton from "./ScheduleMeetingButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

export default function MeetingList() {
  const { userDetails } = useAuth();
  const [previousMeeting, setpreviousMeeting] = useState([]);
  const [upcomingMeeting, setupcomingMeeting] = useState([]);
  const [mentees, setmentees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPreviousMeeting, setFilteredPreviousMeeting] = useState([]);
  const [filteredUpcomingMeeting, setFilteredUpcomingMeeting] = useState([]);
  const [mentorMeetings, setmentorMeetings] = useState("1");
  //   const [role, setrole] = useState(userDetails.role);
  const radios = [
    { name: "Admin Meetings", value: "1" },
    { name: "Mentor Meetings", value: "2" },
  ];

  const fetchMeetings = useCallback(async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/getMeetings/",
        JSON.stringify({
          id: userDetails.id,
          role: userDetails.role,
        })
      );
      if (response.status === 200) {
        if (typeof response.data === "string") {
          const dataObject = JSON.parse(response.data);
          setpreviousMeeting(dataObject.previousMeeting);
          setupcomingMeeting(dataObject.upcomingMeeting);

          setFilteredUpcomingMeeting(
            dataObject.upcomingMeeting.filter((meeting) =>
              meeting.schedulerId.includes(userDetails.id)
            )
          );
          setFilteredPreviousMeeting(
            response.data.previousMeeting.filter((meeting) =>
              meeting.schedulerId.includes(userDetails.id)
            )
          );
        } else if (typeof response.data === "object") {
          setpreviousMeeting(response.data.previousMeeting);
          setupcomingMeeting(response.data.upcomingMeeting);
          setFilteredUpcomingMeeting(
            response.data.upcomingMeeting.filter((meeting) =>
              meeting.schedulerId.includes(userDetails.id)
            )
          );
          setFilteredPreviousMeeting(
            response.data.previousMeeting.filter((meeting) =>
              meeting.schedulerId.includes(userDetails.id)
            )
          );
        }
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  }, [userDetails]);

  const fetchAttributeId = async (id) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/getMentorById/",
        JSON.stringify({ id: id })
      );

      let userData;

      if (typeof response.data === "string") {
        // If response.data is a string, parse it as JSON
        const dataObject = JSON.parse(response.data);
        userData = dataObject;
      } else if (typeof response.data === "object") {
        // If response.data is already an object, access id directly
        userData = response.data;
      }

      if (userData) {
        setmentees(userData.menteesToMentors);
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
    fetchMeetings();

    if (userDetails.role === "mentor") {
      fetchAttributeId(userDetails.id);
    }
  }, [fetchMeetings, userDetails]);

  const deleteMeeting = async (meetingId) => {
    // Send a request to delete the meeting on the backend
    axios
      .post(
        "http://localhost:8000/api/deleteMeetingById/",
        JSON.stringify({
          meetingId: meetingId,
        })
      )
      .then((response) => {
        // If the backend successfully deletes the meeting, update your local state
        alert(response.data.message);
        fetchMeetings();
      })
      .catch((error) => {
        console.error("Error deleting meeting:", error);
      });
  };

  const updateMeetingOnBackend = async (meeting) => {
    try {
      // Replace 'your_api_endpoint' with the actual endpoint where you want to update the meeting on the backend.
      const response = await axios.post(
        "http://localhost:8000/api/editMeetingById/",
        JSON.stringify({
          meetingId: meeting.meetingId,
          schedulerId: meeting.schedulerId,
          title: meeting.title,
          date: meeting.date,
          time: meeting.time,
          attendee: meeting.attendee,
          description: meeting.description,
          mentorBranches: meeting.mentorBranches,
          menteeBranches: meeting.menteeBranches,
          menteeList: meeting.menteeList,
        })
      );
      alert(response.data.message);
      fetchMeetings();
    } catch (error) {
      console.error("Error updating meeting on the backend:", error);
      // Handle errors or display an error message to the user.
    }
  };

  const editMeeting = (meetingId, newValues) => {
    updateMeetingOnBackend(newValues);
    fetchMeetings();
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      const filteredUpcomingList = upcomingMeeting.filter((meeting) =>
        meeting.schedulerId.includes(searchQuery)
      );
      setFilteredUpcomingMeeting(filteredUpcomingList);

      const filteredPreviousList = previousMeeting.filter((meeting) =>
        meeting.schedulerId.includes(searchQuery)
      );
      setFilteredPreviousMeeting(filteredPreviousList);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    var filteredList = upcomingMeeting.filter((meeting) =>
      meeting.schedulerId.includes(userDetails.id)
    );
    setFilteredUpcomingMeeting(filteredList);

    filteredList = previousMeeting.filter((meeting) =>
      meeting.schedulerId.includes(userDetails.id)
    );
    setFilteredPreviousMeeting(filteredList);

    setmentorMeetings("1");
  };

  const handleMentorMeetings = () => {
    setmentorMeetings((prevMentorMeetings) => {
      const newMentorMeetings = prevMentorMeetings === "1" ? "2" : "1"; // Toggle the value
      if (newMentorMeetings === "2") {
        var filteredList = upcomingMeeting.filter(
          (meeting) => meeting.schedulerId !== userDetails.id
        );
        setFilteredUpcomingMeeting(filteredList);

        filteredList = previousMeeting.filter(
          (meeting) => meeting.schedulerId !== userDetails.id
        );
        setFilteredPreviousMeeting(filteredList);
      } else {
        const filteredUpcomingList = upcomingMeeting.filter(
          (meeting) => meeting.schedulerId === userDetails.id
        );
        setFilteredUpcomingMeeting(filteredUpcomingList);

        filteredList = previousMeeting.filter(
          (meeting) => meeting.schedulerId === userDetails.id
        );
        setFilteredPreviousMeeting(filteredList);
      }
      return newMentorMeetings; // Return the updated value
    });
  };

  return (
    <div style={{ backgroundColor: "var(--light-gray)", minHeight: "100vh" }}>
      <Navbar />
      <div
        className="main-content"
        style={{
          marginLeft: "70px",
          padding: "20px",
          transition: "margin-left 0.3s ease"
        }}
      >
        <div className="container-fluid">
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h3 className="font-weight-bold mb-2" style={{ color: "var(--primary-dark-blue)" }}>
                Meeting Schedule
              </h3>
            </div>
          </div>

          <div className="row mb-3">
            {userDetails.role === "admin" && (
              <div className="col-lg-8 col-md-12 mb-3">
                <div className="d-flex flex-column flex-md-row gap-2">
                  <input
                    type="text"
                    className="form-control flex-grow-1"
                    placeholder="Search mentor meetings by roll number"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSearch}
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleClear}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
            {userDetails.role !== "mentee" && (
              <div className={`col-lg-4 col-md-12 ${userDetails.role === "mentor" ? "d-flex justify-content-center" : ""}`}>
                <div style={{ width: "100%", maxWidth: "300px" }}>
                  <ScheduleMeetingButton
                    userDetails={userDetails}
                    fetchMeetings={fetchMeetings}
                    mentees={mentees}
                  />
                </div>
              </div>
            )}
          </div>

          {userDetails.role === "admin" && (
            <div className="row mb-3">
              <div className="col-12 d-flex justify-content-center">
                <div style={{ width: "100%", maxWidth: "400px" }}>
                  <ButtonGroup style={{ width: "100%" }}>
                    {radios.map((radio, idx) => (
                      <ToggleButton
                        key={idx}
                        id={`radio-${idx}`}
                        type="radio"
                        variant={idx % 2 ? "outline-primary" : "outline-primary"}
                        name="radio"
                        value={radio.value}
                        checked={mentorMeetings === radio.value}
                        onChange={handleMentorMeetings}
                        style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}
                      >
                        {radio.name}
                      </ToggleButton>
                    ))}
                  </ButtonGroup>
                </div>
              </div>
            </div>
          )}

          <div className="row">
            <MeetingSection
              title="Upcoming Meetings"
              meetings={
                userDetails.role === "admin"
                  ? filteredUpcomingMeeting
                  : upcomingMeeting
              }
              deleteMeeting={deleteMeeting}
              editMeeting={editMeeting}
              isPreviousMeeting={false}
              userDetails={userDetails}
              mentees={mentees}
            />
            <MeetingSection
              title="Previous Meetings"
              meetings={
                userDetails.role === "admin"
                  ? filteredPreviousMeeting
                  : previousMeeting
              }
              deleteMeeting={deleteMeeting}
              editMeeting={editMeeting}
              isPreviousMeeting={true}
              userDetails={userDetails}
              mentees={mentees}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const MeetingSection = ({
  title,
  meetings,
  deleteMeeting,
  editMeeting,
  isPreviousMeeting,
  userDetails,
  mentees,
}) => {
  const navStyle = {
    backgroundColor: "white",
    padding: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px solid rgba(204, 204, 204, 0.5)",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    borderRadius: "8px 8px 0 0",
  };

  return (
    <div className="col-lg-6 col-md-12 mb-4">
      <div className="card h-100">
        <div style={navStyle}>
          <h4 className="mb-0" style={{ fontSize: "1.30rem", color: "var(--primary-dark-blue)" }}>
            {title}
          </h4>
        </div>
        <div
          className="card-body p-0"
          style={{
            height: "60vh",
            overflowY: "auto"
          }}
        >
          <div className="container-fluid">
            {meetings && meetings.length > 0 ? (
              meetings.map((meet) => (
                <SinlgeMeeting
                  userDetails={userDetails}
                  meet={meet}
                  key={meet.meetingId}
                  ondelete={deleteMeeting}
                  editMeeting={editMeeting}
                  isPreviousMeeting={isPreviousMeeting}
                  mentees={mentees}
                />
              ))
            ) : (
              <div className="text-center py-5">
                <p className="text-muted mb-0">
                  No {isPreviousMeeting ? "previous" : "upcoming"} meetings
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
