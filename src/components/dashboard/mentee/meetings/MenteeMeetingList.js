import React from "react";
import Navbar from "../../common/Navbar";
import { useAuth } from "../../../../context/AuthContext";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import SingleMeeting from "./SingleMeeting";
import '../menteeStyle.css'

export default function MenteeMeetingLists() {
  const { userDetails } = useAuth();
  const [previousMeeting, setpreviousMeeting] = useState([]);
  const [upcomingMeeting, setupcomingMeeting] = useState([]);

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
          // const filteredPreviousMeetings = dataObject.previousMeeting.filter(meeting => meeting.schedulerId === userDetails.mentorId);
          // const filteredUpcomingMeetings = dataObject.upcomingMeeting.filter(meeting => meeting.schedulerId === userDetails.mentorId);

          setpreviousMeeting(dataObject.previousMeeting);
          setupcomingMeeting(dataObject.upcomingMeeting);

        } else if (typeof response.data === "object") {
          console.log("respnse : " + response.data.upcomingMeeting)

          const filteredPreviousMeetings = response.data.previousMeeting.filter(meeting => meeting.schedulerId === userDetails.mentorId);
          const filteredUpcomingMeetings = response.data.upcomingMeeting.filter(meeting => meeting.schedulerId === userDetails.mentorId);

          setpreviousMeeting(filteredPreviousMeetings);
          setupcomingMeeting(filteredUpcomingMeetings);
        }
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  useEffect(() => {
    // if(isFirstTime){setisFirstTime(false);fetchMeetings();}
    fetchMeetings();

    // const filteredPreviousMeetings = previousMeeting.filter(meeting => meeting.schedulerId === userDetails.mentorId);
    // setpreviousMeeting(filteredPreviousMeetings);

  },[]);


  return (
    <div>
      <Navbar className="fixed-top" />
      <div className="container mt-4 text-center mb-4">
        <h1 className="font-weight-bold mb-4">Meeting Schedule</h1>
      </div>

      <div className="row d-flex">
        <MeetingSection title="Upcoming Meetings" meetings={upcomingMeeting} isPreviousMeeting={false} userDetails={userDetails} />
        <MeetingSection title="Previous Meetings" meetings={previousMeeting} isPreviousMeeting={true} userDetails={userDetails}/>
      </div>
    </div>
  );
}

const MeetingSection = ({ title, meetings, isPreviousMeeting,userDetails }) => {
  return (
    <div style={{width : '50%'}}>
      <h3 className="text-center">{title}</h3>
      <div className="container" style={{overflowY: "auto", height : '60vh'}}>
        {meetings && meetings.length > 0 ? (
          meetings.map((meet) => (
            <SingleMeeting
              userDetails={userDetails}
              meet={meet}
              key={meet.meetingId}
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
