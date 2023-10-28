import React from 'react'
import { useState } from 'react';
import TakeMeetingDetails from './TakeMeetingDetails';

export default function SinlgeMeeting({meet, ondelete, editMeeting}) {
  const handleButtonClick = (e) => {
    e.stopPropagation();
  };

  const meetingId = `meeting-${meet.id}`

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    // Add your edit functionality here
    setIsEditing(true);
    console.log('Edit clicked for meeting ID:', meet.id);
  };

  const [editedMeeting, setEditedMeeting] = useState(meet);

  const handleEditSave = () =>{
    editMeeting(meet.id, editedMeeting);
    setIsEditing(false);
  }

  const handleEditClose = () =>{
    setEditedMeeting(meet)
    setIsEditing(false);
  }

  const handleDeleteClick = () => {
    // Add your delete functionality here
    ondelete(meet.id)
    // console.log('Delete clicked for meeting ID:', meet.id);
  };

  const handletitle = (e) => {
    setEditedMeeting({
      ...editedMeeting,
      title: e.target.value,
    });
  };

  const handledate = (e) => {
    setEditedMeeting({
      ...editedMeeting,
      date: e.target.value,
    });
  };

  const handletime = (e) => {
    setEditedMeeting({
      ...editedMeeting,
      time: e.target.value,
    });
  };

  // const handleattendees = (e) => {
  //   const value = e.target.value;
  //   const isChecked = e.target.checked;

  //   setEditedMeeting((prevDetails) => {
  //     const updatedAttendees = isChecked
  //       ? [...prevDetails.attendees, value]
  //       : prevDetails.attendees.filter((attendee) => attendee !== value);
  
  //     return {
  //       ...prevDetails,
  //       attendees: updatedAttendees,
  //     };
  //   });
    
  // };

  return (
    <div className='mb-2' style={{width:'100%'}}>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button" onClick={handleButtonClick} type="button" data-bs-toggle="collapse" data-bs-target={`#${meetingId}`} aria-expanded="true" aria-controls={meetingId}>
              {meet.title}
            </button>
          </h2>
          <div id={meetingId} className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
            <div className="accordion-body" >
              {/* <strong>Meeting ID : {meet.id}, Meeting Title : {meet.title}</strong>  */}
              <strong>Meeting ID : {meet.id}, Meeting Title : {meet.title}</strong>
              <p>Time: {meet.time}</p>
              <p>Date: {meet.date}</p>
              <p>Attendees: All Assigned Mentees</p>
              <div className='mt-3'>
                <button className="btn btn-danger mx-2" onClick={handleDeleteClick}>Delete</button>
                <button className="btn btn-primary mx-2" onClick={handleEditClick}>Edit</button>
              </div>
            </div>
          </div>

          { isEditing && 

            <TakeMeetingDetails
              currmeeting={editedMeeting}
              handleClose={handleEditClose}
              handleSave={handleEditSave}
              handledate={handledate}
              handletime={handletime}
              handletitle={handletitle}
            />

          }
        </div>
      </div>
    </div>
    
  )
}
