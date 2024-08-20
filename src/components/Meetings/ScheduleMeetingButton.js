import React, { useState } from "react";
// import Formelement from './Formelement';
import TakeMeetingDetails from "./TakeMeetingDetails";
import axios from "axios"; // Import Axios
import departmentOptions from "../../data/departmentOptions.json";

const ScheduleMeetingButton = ({ userDetails, fetchMeetings, mentees }) => {

  if (userDetails.role === "admin") {
    userDetails.id = 1;
  }

  const [showModal, setShowModal] = useState(false);
  const [currmeeting, setcurrmeeting] = useState({
    id: null,
    schedulerId: userDetails.id,
    time: "",
    date: "",
    title: "",
    description: "",
    attendee: userDetails.role === "mentor" ? "Mentees" : [],
    mentorBranches: [],
    menteeBranches: [],
    menteeList: [],
  });

  const handleScheduleClick = () => {
    setcurrmeeting({
      id: null,
      time: "",
      schedulerId: userDetails.id,
      date: "",
      title: "",
      description: "",
      attendee: userDetails.role === "mentor" ? "Mentees" : [],
      mentorBranches: [],
      menteeBranches: [],
      menteeList: [],
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveModal = async () => {
    try {
      const newMeeting = { ...currmeeting, id: Date.now() };
      setcurrmeeting(newMeeting); // Update the current meeting state
      const meetingData = {
        title: newMeeting.title,
        schedulerId: newMeeting.schedulerId,
        date: newMeeting.date,
        time: newMeeting.time,
        attendee: newMeeting.attendee,
        description: newMeeting.description,
        mentorBranches: newMeeting.mentorBranches,
        menteeBranches: newMeeting.menteeBranches,
        menteeList: newMeeting.menteeList,
      };
      const response = await axios.post(
        "https://smpportal.iiitd.edu.in/api/addMeeting/",
        meetingData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log(response);
        alert("Meeting added successfully");
        // Once the meeting is successfully added, fetch the updated meetings
        fetchMeetings();
      } else {
        alert(response.data.error);
      }
      setShowModal(false);
    } catch (error) {
      alert("Error adding meeting");
    }
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

  const handleBranch = (e, val) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    setcurrmeeting((prevDetails) => {
      if (isChecked) {
        return val === "Mentor"
          ? {
            ...prevDetails,
            mentorBranches: [...prevDetails.mentorBranches, value],
          }
          : {
            ...prevDetails,
            menteeBranches: [...prevDetails.menteeBranches, value],
          };
      } else {
        return val === "Mentor"
          ? {
            ...prevDetails,
            mentorBranches: prevDetails.mentorBranches.filter(
              (mentorBranches) => mentorBranches !== value
            ),
          }
          : {
            ...prevDetails,
            menteeBranches: prevDetails.menteeBranches.filter(
              (menteeBranches) => menteeBranches !== value
            ),
          };
      }
    });
  };

  const handleAllBranchesChange = (e, val) => {
    const isChecked = e.target.checked;
    const allBranches = Object.keys(departmentOptions);

    setcurrmeeting((prevDetails) => {
      if (isChecked) {
        // If "All Branches" is checked, set mentorBranches to all branch keys
        return val === "Mentor"
          ? {
            ...prevDetails,
            mentorBranches: allBranches,
          }
          : {
            ...prevDetails,
            menteeBranches: allBranches,
          };
      } else {
        // Set mentorBranches to an empty array if no individual branch is selected
        return val === "Mentor"
          ? {
            ...prevDetails,
            mentorBranches: [],
          }
          : {
            ...prevDetails,
            menteeBranches: [],
          };
      }
    });
  };

  const handleMentee = (e) => {
    let value = e.target.value;
    let isChecked = e.target.checked;

    setcurrmeeting((prevDetails) => {
      if (isChecked) {
        return {
          ...currmeeting,
          menteeList: [...prevDetails.menteeList, value],
        };
      } else {
        return {
          ...currmeeting,
          menteeList: prevDetails.menteeList.filter(
            (mentee) => mentee !== value
          ),
        };
      }
    });
  };

  return (
    <>
      <div style={userDetails.role === 'mentor' ? { display: 'flex', alignContent: 'center', justifyContent: 'center' } : { float: "right", paddingRight: "1.25rem" }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleScheduleClick}
        >
          {userDetails.role === 'admin' ? (
            <>Schedule New Meeting</>
          ) : (
            <>Schedule new meeting for your mentees</>
          )}
        </button>
      </div>

      {showModal && (
        <TakeMeetingDetails
          currmeeting={currmeeting}
          handleClose={handleCloseModal}
          handleSave={handleSaveModal}
          handledate={handledate}
          handletime={handletime}
          handletitle={handletitle}
          handleDescription={handleDescription}
          handleBranch={handleBranch}
          handleAllBranchesChange={handleAllBranchesChange}
          handleattendees={handleattendees}
          mentees={mentees}
          handleMentee={handleMentee}
          role={userDetails.role}
        />
      )}
    </>
  );
};

export default ScheduleMeetingButton;
