import React, { useState } from 'react';
// import Formelement from './Formelement';
import TakeMeetingDetails from './TakeMeetingDetails';
import axios from 'axios'; // Import Axios
import departmentOptions from "../../../../data/departmentOptions.json";

const ScheduleMeetingButton = ({userDetails,fetchMeetings }) => {
  const [showModal, setShowModal] = useState(false);
  const [currmeeting, setcurrmeeting] = useState({
    id: null,
    schedulerId: userDetails.id,
    time: "",
    date: "",
    title: "",
    description: "",
    attendee: [],
    mentorBranches : []
  });

  const handleScheduleClick = () => {
    setcurrmeeting({
      id: null,
      time: "",
      schedulerId: userDetails.id,
      date: "",
      title: "",
      description: "",
      attendee: [],
      mentorBranches : []
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveModal = () => {
    const newMeeting = { ...currmeeting, id: Date.now() };
    setcurrmeeting(newMeeting); // Update the current meeting state

    console.log("Here")
    console.log(newMeeting)

    const meetingData = {
      title: newMeeting.title,
      schedulerId: newMeeting.schedulerId,
      date: newMeeting.date,
      time: newMeeting.time,
      attendee: newMeeting.attendee,
      description: newMeeting.description,
      mentorBranches: newMeeting.mentorBranches
    };

    axios
      .post('http://127.0.0.1:8000/addMeeting/', meetingData, {
        headers: {
          'Content-Type': 'application/json', 
        },
      })
      .then((response) => {
        if (response.status === 200) {
          alert('Meeting added successfully');
        }
      })
      .catch((error) => {
        console.error('Error adding meeting', error);
      });

    setShowModal(false);
    fetchMeetings();
  };

  const handletitle = (e) => {
    setcurrmeeting({
      ...currmeeting,
      title: e.target.value,
    });
  };

  const handledate = (e) => {
    setcurrmeeting({
      ...currmeeting,
      date: e.target.value,
    });
  };

  const handletime = (e) => {
    setcurrmeeting({
      ...currmeeting,
      time: e.target.value,
    });
  };

  const handleattendees = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    setcurrmeeting((prevDetails) => {
      if (isChecked) {
        return {
          ...prevDetails,
          attendee: [...prevDetails.attendee, value],
        };
      } else {
        return {
          ...prevDetails,
          attendee: prevDetails.attendee.filter(
            (attendee) => attendee !== value
          ),
        };
      }
    });
  };

  const handleDescription = (e) => {
    setcurrmeeting({ ...currmeeting, description: e.target.value });
  };

  const handleBranch = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    setcurrmeeting((prevDetails) => {
      if (isChecked) {
        return {
          ...prevDetails,
          mentorBranches: [...prevDetails.mentorBranches, value],
        };
      } else {
        return {
          ...prevDetails,
          mentorBranches: prevDetails.mentorBranches.filter(
            (mentorBranches) => mentorBranches !== value
          ),
        };
      }
    });
  }

  const handleAllBranchesChange = (e) => {
    const isChecked = e.target.checked;
    const allBranches = Object.keys(departmentOptions);
  
    setcurrmeeting((prevDetails) => {
      if (isChecked) {
        // If "All Branches" is checked, set mentorBranches to all branch keys
        return {
          ...prevDetails,
          mentorBranches: allBranches,
        };
      } else {
        // Set mentorBranches to an empty array if no individual branch is selected
        return {
          ...prevDetails,
          mentorBranches: [],
        };
      }
    });
  };

  return (
    <div>
      {/* <i class="bi bi-plus-circle"></i> */}
      <button
        className="btn btn-primary btn-floating position-fixed"
        style={{ bottom: "5%", right: '4%'}}
        onClick={handleScheduleClick}
      >
        {/* Schedule Meeting */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          className="bi bi-plus-circle"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
      </button>

      {showModal && (
        <TakeMeetingDetails
          currmeeting={currmeeting}
          handleClose={handleCloseModal}
          handleSave={handleSaveModal}
          handleattendees={handleattendees}
          handledate={handledate}
          handletime={handletime}
          handletitle={handletitle}
          handleDescription={handleDescription}
          handleBranch={handleBranch}
          handleAllBranchesChange={handleAllBranchesChange}
        />
      )}
    </div>
  );
};

export default ScheduleMeetingButton;
