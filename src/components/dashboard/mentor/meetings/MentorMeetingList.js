import React from "react";
import Navbar from "../../common/Navbar";
import { useAuth } from "../../../../context/AuthContext";
import { useState } from "react";
import SinlgeMeeting from './SinlgeMeeting';
import ScheduleMeetingButton from './ScheduleMeetingButton';
import axios from "axios";
import { useEffect } from "react";

export default function MentorMeetingList() {
  const { userDetails } = useAuth();

  // const [usermeetings, setusermeetings] = useState([]);
  const [previousMeeting, setpreviousMeeting] = useState([]);
  const [upcomingMeeting, setupcomingMeeting] = useState([]);
  const [mentees, setmentees] = useState([]);

  const fetchMeetings = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/getMeetings/",
      JSON.stringify({
        id: userDetails.id, 
        role: userDetails.role
      }));
      if (response.status === 200) {
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

  const fetchAttributeId = async (id) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/getMentorById/",
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
        // console.log("Attribute ID:", id);
        // Update the userDetails with the retrieved 'id'
        setmentees(userData.menteesToMentors)
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
    // if(isFirstTime){setisFirstTime(false);fetchMeetings();}
    fetchMeetings();
    fetchAttributeId(userDetails.id)
  },[]);


  const deleteMeeting = (meetingId) => {
    // Implement your delete logic here
    // setusermeetings(prevMeetings => prevMeetings.filter(meet => meet.id !== meetingId));

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
          schedulerId: meeting.schedulerId,
          title: meeting.title,
          date: meeting.date,
          time: meeting.time,
          attendee: meeting.attendee,
          description: meeting.description,
          menteeList : meeting.menteeList
        }))
        .then((response) => {
          // If the backend successfully updates the meeting, update your local state
          if (response.status === 200) {
            // setmeetings(meeting);
            console.log("Meeting updated successfully on the backend");
          }
        });
    } catch (error) {
      console.error("Error updating meeting on the backend:", error);
      // Handle errors or display an error message to the user.
    }
  };

  const editMeeting = (meetingId, newValues) => {
    updateMeetingOnBackend(newValues);
    fetchMeetings();

  };

  return (
    <div>
      <Navbar className="fixed-top" />
      <div className="container mt-4 text-center mb-4">
        <h1 className="font-weight-bold mb-4">Meeting Schedule</h1>
      </div>

      <div className="row d-flex">
        <MeetingSection title="Upcoming Meetings" meetings={upcomingMeeting} deleteMeeting={deleteMeeting} editMeeting={editMeeting} isPreviousMeeting={false} userDetails={userDetails} mentees = {mentees} />
        <MeetingSection title="Previous Meetings" meetings={previousMeeting} deleteMeeting={deleteMeeting} editMeeting={editMeeting} isPreviousMeeting={true} userDetails={userDetails} mentees = {mentees}/>

        <div>
          <ScheduleMeetingButton userDetails={userDetails} fetchMeetings={fetchMeetings} mentees = {mentees}/>
        </div>
      </div>
    </div>
  );
}

const MeetingSection = ({ title, meetings, deleteMeeting, editMeeting, isPreviousMeeting,userDetails, mentees}) => {
  return (
    <div style={{width : '45%'}}>
      <h3 className="text-center">{title}</h3>
      <div className="container" style={{height : '60vh', overflowY:"auto" }}>
        {meetings && meetings.length > 0 ? (
          meetings.map((meet) => (
            <SinlgeMeeting
              userDetails={userDetails}
              meet={meet}
              key={meet.meetingId}
              ondelete={deleteMeeting}
              editMeeting={editMeeting}
              isPreviousMeeting={isPreviousMeeting}
              mentees = {mentees}
            />
          ))
        ) : (
          <p>No {isPreviousMeeting ? 'previous' : 'upcoming'} meetings</p>
        )}
      </div>
    </div>
  );
};
