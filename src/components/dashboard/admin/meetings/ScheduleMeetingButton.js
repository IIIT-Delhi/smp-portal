import React, { useState } from 'react';
// import Formelement from './Formelement';
import TakeMeetingDetails from './TakeMeetingDetails';

const ScheduleMeetingButton = ({setmeetings}) => {
    const [showModal, setShowModal] = useState(false);
    const [currmeeting, setcurrmeeting] = useState({
        id : null,
        time : '',
        date : '',
        title : '',
        Descriptoin : '',
        attendees : [],
    });



    const handleScheduleClick = () => {
        setcurrmeeting({
            id : null,
            time: '',
            date: '',
            title: '',
            Description : '',
            attendees: [],
          });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSaveModal = () => {
        const newMeeting = { ...currmeeting, id: Date.now() }
        setcurrmeeting(newMeeting); // Update the current meeting state
        setmeetings(prevMeetings => [...prevMeetings, newMeeting]); // Add the new meeting to meetings
        setShowModal(false);
    }

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
              attendees: [...prevDetails.attendees, value],
            };
          } else {
            return {
              ...prevDetails,
              attendees: prevDetails.attendees.filter((attendee) => attendee !== value),
            };
          }
        });
    };

    const handleDescription = (e) => {
      setcurrmeeting(
        {...currmeeting,
        Description: e.target.value}
      )
    }
    

    return (
      <div>
        {/* <i class="bi bi-plus-circle"></i> */}
        <button
          className="btn btn-primary btn-floating position-fixed d-flex justify-content-center align-items-center"
          style={{ bottom: "10%" ,fontSize: "40px !important"}}
          onClick={handleScheduleClick}
        >
          {/* Schedule Meeting */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            class="bi bi-plus-circle"
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
            handleDescription = {handleDescription}
          />
        )}
      </div>
    );
};

export default ScheduleMeetingButton;
