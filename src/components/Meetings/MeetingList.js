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
        "http://127.0.0.1:8000/api/getMeetings/",
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
        "http://127.0.0.1:8000/api/getMentorById/",
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
        "http://127.0.0.1:8000/api/deleteMeetingById/",
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
        "http://127.0.0.1:8000/api/editMeetingById/",
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
    <div>
      <Navbar className="fixed-top" />
      <div className="container mt-2 text-center mb-3">
        <h3 className="font-weight-bold mb-2">Meeting Schedule</h3>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: "2%",
          justifyContent: userDetails.role === "mentor" ? "center" : "none",
        }}
      >
        {userDetails.role === "admin" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "80%",
              justifyContent: "center",
            }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Search mentor meetings by roll number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              style={{ width: "80%" }}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSearch}
              style={{ marginLeft: "10px" }}
            >
              Search
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClear}
              style={{ marginLeft: "10px" }}
            >
              Clear
            </button>
          </div>
        )}
        {userDetails.role !== "mentee" && (
          <div style={{ width: "30%" }}>
            <ScheduleMeetingButton
              userDetails={userDetails}
              fetchMeetings={fetchMeetings}
              mentees={mentees}
            />
          </div>
        )}
      </div>
      {userDetails.role === "admin" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginTop: "2%",
          }}
        >
          <div style={{ width: "30%" }}>
            {" "}
            {/* Adjust the width as needed */}
            <ButtonGroup style={{ width: "100%", justifyContent: "center" }}>
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
                  style={{ padding: "0.25rem 0.25rem", fontSize: "1rem" }}
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </div>
        </div>
      )}
      <div
        style={{
          width: "100%",
          justifyContent: "center",
          marginTop: "1%",
          display: "flex",
        }}
      >
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
    // backgroundColor: "#3fada8",
    backgroundColor: "white",
    padding: "0.5rem 0.5rem",
    display: "flex",
    justifyContent: "space-between", // Align items horizontally
    alignItems: "center", // Align items vertical
    borderBottom: "1px solid rgba(204, 204, 204, 0.5)",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", // Add shadow near the bottom border
    textAlign: "center",
  };

  return (
    <div style={{ width: "50%", padding: "1%", borderTop: "2px solid #ccc" }}>
      <div style={navStyle}>
        <h4
          className="text-center"
          style={{ fontSize: "1.30rem", margin: "0 auto" }}
        >
          {" "}
          {title}
        </h4>
      </div>
      <div
        className="container"
        style={{ height: "60vh", overflowY: "auto", marginTop: "1%" }}
      >
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
          <p style={{ textAlign: "center" }}>
            No {isPreviousMeeting ? "previous" : "upcoming"} meetings
          </p>
        )}
      </div>
    </div>
  );
};
