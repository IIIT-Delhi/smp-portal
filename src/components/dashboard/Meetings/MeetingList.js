import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios'; // Import Axios
import Navbar from "../common/Navbar";
import { useAuth } from "../../../context/AuthContext";
import SinlgeMeeting from "./SingleMeeting";
import ScheduleMeetingButton from "./ScheduleMeetingButton";

export default function MeetingList() {
  const { userDetails } = useAuth() ;
  const [previousMeeting, setpreviousMeeting] = useState([]);
  const [upcomingMeeting, setupcomingMeeting] = useState([]);
  const [mentees, setmentees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPreviousMeeting, setFilteredPreviousMeeting] = useState([]);
  const [filteredUpcomingMeeting, setFilteredUpcomingMeeting] = useState([]);
//   const [role, setrole] = useState(userDetails.role);

  const fetchMeetings = useCallback( async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/getMeetings/",
      JSON.stringify({
        id: userDetails.id, 
        role: userDetails.role
      }));
      if (response.status === 200) {
        if (typeof response.data === "string") {
          const dataObject = JSON.parse(response.data);
          setpreviousMeeting(dataObject.previousMeeting);
          setupcomingMeeting(dataObject.upcomingMeeting);

          setFilteredUpcomingMeeting(dataObject.upcomingMeeting.filter(
            meeting => meeting.schedulerId.includes(userDetails.id)
          ));
          setFilteredPreviousMeeting(response.data.previousMeeting.filter(
            meeting => meeting.schedulerId.includes(userDetails.id)
          ));

        } else if (typeof response.data === "object") {
          console.log(response.data)
          setpreviousMeeting(response.data.previousMeeting);
          setupcomingMeeting(response.data.upcomingMeeting);
          setFilteredUpcomingMeeting(response.data.upcomingMeeting.filter(
            meeting => meeting.schedulerId.includes(userDetails.id)
          ));
          setFilteredPreviousMeeting(response.data.previousMeeting.filter(
            meeting => meeting.schedulerId.includes(userDetails.id)
          ));
        }
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }

  },[userDetails]);

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
        console.log(userData.menteesToMentors)
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

    fetchMeetings();

    if(userDetails.role === "mentor"){
        fetchAttributeId(userDetails.id)
    }
    
  },[fetchMeetings,userDetails]);

  const deleteMeeting = (meetingId) => {
    // Send a request to delete the meeting on the backend
    axios
      .post("http://127.0.0.1:8000/deleteMeetingById/", JSON.stringify({
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
        .post("http://127.0.0.1:8000/editMeetingById/", JSON.stringify({
          meetingId: meeting.meetingId, 
          schedulerId: meeting.schedulerId,
          title: meeting.title,
          date: meeting.date,
          time: meeting.time,
          attendee: meeting.attendee,
          description: meeting.description,
          mentorBranches: meeting.mentorBranches,
          menteeBranches: meeting.menteeBranches,
          menteeList: meeting.menteeList
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

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      const filteredUpcomingList = upcomingMeeting.filter(
        (meeting) =>
          meeting.schedulerId.includes(searchQuery)
      );
      setFilteredUpcomingMeeting(filteredUpcomingList);
  
      const filteredPreviousList = previousMeeting.filter(
        (meeting) =>
          meeting.schedulerId.includes(searchQuery)
      );
      setFilteredPreviousMeeting(filteredPreviousList);
    }
  }

  const handleClear = () => {
    setSearchQuery('')
    var filteredList = upcomingMeeting.filter(
      (meeting) =>
        meeting.schedulerId.includes(userDetails.id)
    );
    setFilteredUpcomingMeeting(filteredList);

    filteredList = previousMeeting.filter(
      (meeting) =>
        meeting.schedulerId.includes(userDetails.id)
    );
    setFilteredPreviousMeeting(filteredList);
  } 

  return (
    <div>
      <Navbar className="fixed-top" />
      <div className="container mt-2 text-center mb-3">
        <h2 className="font-weight-bold mb-2">Meeting Schedule</h2>
      </div>

      {userDetails.role==='admin' && (
        <div className="mb-3 mt-2" style={{display:'flex', alignItems: 'center', justifyContent: 'center'}}>
          <input
            type="text"
            className="form-control"
            placeholder="Search Mentor Meetings by roll number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{width:'40%', marginRight:'1%'}}
          />

          <button type="button" className="btn btn-primary" onClick={handleSearch} style={{marginRight:'1%'}}>
            Search
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleClear}>
            clear
          </button>
        </div>
      )}

      <div className='row d-flex'>
        <MeetingSection title="Upcoming Meetings" meetings={userDetails.role==='admin' ? filteredUpcomingMeeting : upcomingMeeting} deleteMeeting={deleteMeeting} editMeeting={editMeeting} isPreviousMeeting={false} userDetails={userDetails} mentees={mentees} />
        <MeetingSection title="Previous Meetings" meetings={userDetails.role==='admin' ? filteredPreviousMeeting : previousMeeting} deleteMeeting={deleteMeeting} editMeeting={editMeeting} isPreviousMeeting={true} userDetails={userDetails} mentees={mentees}/>

        {userDetails.role !== "mentee" && (
        <div>
          <ScheduleMeetingButton userDetails={userDetails} fetchMeetings={fetchMeetings} mentees={mentees}/>
        </div>
        )}

      </div>
    </div>
  );
}

const MeetingSection = ({ title, meetings, deleteMeeting, editMeeting, isPreviousMeeting,userDetails, mentees }) => {
  return (
    <div style={{width:'45%'}}>
      <h4 className="text-center"> {title}</h4>
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
              mentees = {mentees}
            />
          ))
        ) : (
          <p style={{textAlign:'center'}}>No {isPreviousMeeting ? 'previous' : 'upcoming'} meetings</p>
        )}
      </div>
    </div>
  );
};