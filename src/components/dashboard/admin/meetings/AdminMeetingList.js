import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios'; // Import Axios
import Navbar from "../../common/Navbar";
import { useAuth } from "../../../../context/AuthContext";
import SinlgeMeeting from "./SinlgeMeeting";
import ScheduleMeetingButton from "./ScheduleMeetingButton";

export default function AdminMeetingList() {
  const { userDetails } = useAuth() ;
  // console.log(userDetails.role)
  // const [meetings, setmeetings] = useState([]);
  const [previousMeeting, setpreviousMeeting] = useState([]);
  const [upcomingMeeting, setupcomingMeeting] = useState([]);
  // const[isFirstTime,setisFirstTime] = useState(true);
  const fetchMeetings = useCallback( async () => {
    try {
      console.log(userDetails)
      const response = await axios.post("https://smpportal.iiitd.edu.in/api/getMeetings/",
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
  },[userDetails]);

  useEffect(() => {
    // if(isFirstTime){setisFirstTime(false);fetchMeetings();}
    fetchMeetings();
  },[fetchMeetings]);

  const deleteMeeting = (meetingId) => {
    // Send a request to delete the meeting on the backend
    axios
      .post("https://smpportal.iiitd.edu.in/api/deleteMeetingById/", JSON.stringify({
        meetingId: meetingId
      }))
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
      console.log(meeting.meetingId)
      // Replace 'your_api_endpoint' with the actual endpoint where you want to update the meeting on the backend.
      const response = await axios
        .post("https://smpportal.iiitd.edu.in/api/editMeetingById/", JSON.stringify({
          meetingId: meeting.meetingId, 
          schedulerId: meeting.schedulerId,
          title: meeting.title,
          date: meeting.date,
          time: meeting.time,
          attendee: meeting.attendee,
          description: meeting.description,
          mentorBranches: meeting.mentorBranches
        }))

        console.log(response.data.message)
        alert(response.data.message);
        fetchMeetings();

    } catch (error) {
      console.error("Error updating meeting on the backend:", error);
      // Handle errors or display an error message to the user.
    }
  };

  const editMeeting = (meetingId, newValues) => {
    console.log(newValues)
    updateMeetingOnBackend(newValues);
    fetchMeetings();
  };

  return (
    <div>
      <Navbar className="fixed-top" />
      <div className="container mt-4 text-center mb-4">
        <h1 className="font-weight-bold mb-4">Meeting Schedule</h1>
      </div>

      <div className='row d-flex'>
        <MeetingSection title="Upcoming Meetings" meetings={upcomingMeeting} deleteMeeting={deleteMeeting} editMeeting={editMeeting} isPreviousMeeting={false} userDetails={userDetails} />
        <MeetingSection title="Previous Meetings" meetings={previousMeeting} deleteMeeting={deleteMeeting} editMeeting={editMeeting} isPreviousMeeting={true} userDetails={userDetails}/>

        <div>
          <ScheduleMeetingButton userDetails={userDetails} fetchMeetings={fetchMeetings} />
        </div>
      </div>
    </div>
  );
}

const MeetingSection = ({ title, meetings, deleteMeeting, editMeeting, isPreviousMeeting,userDetails }) => {
  return (
    <div style={{width:'45%'}}>
      <h3 className="text-center"> {title}</h3>
      <div className="container" style={{height: '60vh', overflowY: "auto" }}>
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