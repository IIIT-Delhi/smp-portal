import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import Navbar from "../../common/Navbar";
import { useAuth } from "../../../../context/AuthContext";
import SinlgeMeeting from "./SinlgeMeeting";
import ScheduleMeetingButton from "./ScheduleMeetingButton";

export default function AdminMeetingList() {
  const { userDetails } = useAuth();
  const [meetings, setmeetings] = useState([]);
  const [previousMeeting, setpreviousMeeting] = useState([]);
  const [upcomingMeeting, setupcomingMeeting] = useState([]);

  const fetchMeetings = async () => {
    try {
      console.log(userDetails)
      {
        console.log(userDetails)
        const response = await axios.post("http://127.0.0.1:8000/getMeetings/",
        JSON.stringify({
          id: userDetails.id,
          role: userDetails.role
        }));
      console.log("respnse : " + response.data)
      if (response.status === 200) {
        console.log("response : " + response.data)
        if (typeof response.data === "string") {
          const dataObject = JSON.parse(response.data);
          
          // setmeetings(dataObject)
          setpreviousMeeting(dataObject.previousMeeting);
          setupcomingMeeting(dataObject.upcomingMeeting);

        } else if (typeof response.data === "object") {
          // setmeetings(response.data)
          setpreviousMeeting(response.data.previousMeeting);
          setupcomingMeeting(response.data.upcomingMeeting);
        }
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const deleteMeeting = (meetingId) => {
    // Send a request to delete the meeting on the backend
    axios
      .get("http://127.0.0.1:8000/deleteMeetingById/", meetingId)
      .then((response) => {
        // If the backend successfully deletes the meeting, update your local state
        if (response.status === 200) {
          setmeetings((prevMeetings) =>
            prevMeetings.filter((meet) => meet.id !== meetingId)
          );
        }
      })
      .catch((error) => {
        console.error("Error deleting meeting:", error);
      });
  };
  const updateMeetingOnBackend = async (meeting) => {
    try {
      // Replace 'your_api_endpoint' with the actual endpoint where you want to update the meeting on the backend.
      await axios
        .post("http://127.0.0.1:8000/editMeetingById/", meeting)
        .then((response) => {
          // If the backend successfully updates the meeting, update your local state
          if (response.status === 200) {
            setmeetings(meeting);
            console.log("Meeting updated successfully on the backend");
          }
        });
    } catch (error) {
      console.error("Error updating meeting on the backend:", error);
      // Handle errors or display an error message to the user.
    }
  };

  const editMeeting = (meetingId, newValues) => {
    const updatedMeetings = meetings.map((meet) =>
      meet.id === meetingId ? { ...meet, ...newValues } : meet
    );
    updateMeetingOnBackend(updatedMeetings);
  };

  return (
    <div>
      <Navbar className="fixed-top" />
      <div className="container mt-4 text-center mb-4">
        <h1 className="font-weight-bold mb-4">Meeting Schedule</h1>
      </div>

      <div
        style={{
          display: "flex",
          height: "70vh",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <h2>Upcoming Meetings</h2>
        <div
          className="container"
          style={{
            marginLeft: "5px",
            marginRight: "0",
            width: "85%",
            overflowY: "auto",
          }}
        > 

          {upcomingMeeting.map((meet) => (
            <SinlgeMeeting
              userDetails={userDetails}
              meet={meet}
              key={meet.id}
              ondelete={deleteMeeting}
              editMeeting={editMeeting}
              isPreviousMeeting={false}
            />
          ))}
        </div>

        <h2>Previous Meetings</h2>
        <div
          className="container"
          style={{
            marginLeft: "5px",
            marginRight: "0",
            width: "85%",
            overflowY: "auto",
          }}
        > 

          {previousMeeting.map((meet) => (
            <SinlgeMeeting
              userDetails={userDetails}
              meet={meet}
              key={meet.id}
              ondelete={deleteMeeting}
              editMeeting={editMeeting}
              isPreviousMeeting={true}
            />
          ))}
        </div>

        <div
          style={{
            position: "relative",
            width: "20%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <ScheduleMeetingButton
            // setmeetings={setmeetings}
            userDetails={userDetails}
            fetchMeetings={fetchMeetings}
          />
        </div>

        {/* <div style={{ position: 'fixed', bottom: '20px', right: '20px', border: '2px solid blue' }}>
          <ScheduleMeetingButton setmeetings = {setmeetings} ></ScheduleMeetingButton>
        </div> */}
      </div>
    </div>
  );
}