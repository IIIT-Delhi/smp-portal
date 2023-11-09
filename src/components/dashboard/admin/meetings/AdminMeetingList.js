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
  const[isFirstTime,setisFirstTime] = useState(true);
  const fetchMeetings = async () => {
    try {
      console.log(userDetails)
      const response = await axios.post("http://127.0.0.1:8000/getMeetings/",
      JSON.stringify({
        id: userDetails.id, 
        role: userDetails.role
      }));
      if (response.status === 200) {
        console.log("response : " + response.data)
        if (typeof response.data === "string") {
          const dataObject = JSON.parse(response.data);
          // console.log("respnse : " + response.data.previousMeeting)
          // setmeetings(dataObject)
          setpreviousMeeting(dataObject.previousMeeting);
          setupcomingMeeting(dataObject.upcomingMeeting);

        } else if (typeof response.data === "object") {
          console.log("respnse : " + response.data.upcomingMeeting)
          setpreviousMeeting(response.data.previousMeeting);
          setupcomingMeeting(response.data.upcomingMeeting);
        }
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };
  useEffect(() => {
    if(isFirstTime){setisFirstTime(false);fetchMeetings();}
  }, [isFirstTime]);

  const deleteMeeting = (meetingId) => {
    // Send a request to delete the meeting on the backend
    axios
      .post("http://127.0.0.1:8000/deleteMeetingById/", JSON.stringify({
        meetingId: meetingId
      }))
      .then((response) => {
        // If the backend successfully deletes the meeting, update your local state
        if (response.status === 200) {
          // setmeetings((prevMeetings) =>
          //   prevMeetings.filter((meet) => meet.id !== meetingId)
          // );
          fetchMeetings();

        }
      })
      .catch((error) => {
        console.error("Error deleting meeting:", error);
      });
  };
  
  const updateMeetingOnBackend = async (meeting) => {
    try {
      console.log(meeting.meetingId)
      // Replace 'your_api_endpoint' with the actual endpoint where you want to update the meeting on the backend.
      await axios
        .post("http://127.0.0.1:8000/editMeetingById/", JSON.stringify({
          meetingId: meeting.meetingId, 
          tile: meeting.title,
          date: meeting.date,
          time: meeting.time,
          attendee: meeting.attendee,
          description: meeting.description,
        }))
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

  // const convertAttendeeToArr = (attendeeValue) => {
  //   switch (attendeeValue) {
  //     case 1:
  //       return [1]; // Mentor
  //     case 2:
  //       return [2]; // Mentee
  //     case 3:
  //       return [1, 2]; // Mentor and Mentee
  //     default:
  //       return [];
  //   }
  // };

  // const editMeeting = (meetingId, newValues) => {
  //   const updatedMeetings = meetings.map((meet) => {
  //     if (meet.meetingId === meetingId) {
  //       const attendee = convertAttendeeToArr(newValues.attendee);
  //       return { ...meet, ...newValues, attendee };
  //     } else {
  //       return meet;
  //     }
  //   });

  const editMeeting = (meetingId, newValues) => {
    const updatedMeetings = meetings.map((meet) =>
      meet.meetingId === meetingId ? { ...meet, ...newValues } : meet
    );
    updateMeetingOnBackend(updatedMeetings);
  };

  return (
    <div>
      <Navbar className="fixed-top" />
      <div className="container mt-4 text-center mb-4">
        <h1 className="font-weight-bold mb-4">Meeting Schedule</h1>
      </div>

      <div style={{ display: "flex", height: "70px", justifyContent: "center", position: "relative" }}>
        <MeetingSection title="Upcoming Meetings" meetings={upcomingMeeting} deleteMeeting={deleteMeeting} editMeeting={editMeeting} isPreviousMeeting={false} userDetails={userDetails} />
        <MeetingSection title="Previous Meetings" meetings={previousMeeting} deleteMeeting={deleteMeeting} editMeeting={editMeeting} isPreviousMeeting={true} userDetails={userDetails}/>

        <div style={{ position: "relative", width: "15%", display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
          <ScheduleMeetingButton userDetails={userDetails} fetchMeetings={fetchMeetings} />
        </div>
      </div>
    </div>
  );
}

const MeetingSection = ({ title, meetings, deleteMeeting, editMeeting, isPreviousMeeting,userDetails }) => {
  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="container mt-4" style={{ marginLeft: "5px", marginRight: "0", width: "85%", overflowY: "auto" }}>
        {meetings && meetings.length > 0 ? (
          meetings.map((meet) => (
            <SinlgeMeeting
              userDetails={userDetails}
              meet={meet}
              key={meet.meetingId}
              ondelete={deleteMeeting}
              editMeeting={editMeeting}
              isPreviousMeeting={isPreviousMeeting}
            />
          ))
        ) : (
          <p>No {isPreviousMeeting ? 'previous' : 'upcoming'} meetings</p>
        )}
      </div>
    </div>
  );
};