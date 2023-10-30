import React from 'react'
import { useState } from 'react';
import TakeMeetingDetails from './TakeMeetingDetails';

export default function SinlgeMeeting({meet, ondelete, editMeeting}) {
  const handleButtonClick = (e) => {
    e.stopPropagation();
  };

  const meetingId = `meeting-${meet.id}`

  const [isEditing, setIsEditing] = useState(false);

  const [confirmdelete, setconfirmdelete] = useState(false);

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
    setconfirmdelete(true)
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

  const handleattendees = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    setEditedMeeting((prevDetails) => {
      const updatedAttendees = isChecked
        ? [...prevDetails.attendees, value]
        : prevDetails.attendees.filter((attendee) => attendee !== value);
  
      return {
        ...prevDetails,
        attendees: updatedAttendees,
      };
    });
    
  };

  const handleDescription = (e) =>{
    setEditedMeeting({
      ...editedMeeting,
      Description: e.target.value,
    })
  }

  const handleCancelDelete = () => {
    setconfirmdelete(false)
  }

  const handleConfirmDelete = () => {
    ondelete(meet.id)
    setconfirmdelete(false)
  }

  return (
    <div className='mb-2' style={{width:'100%'}}>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button btn-sm collapsed" onClick={handleButtonClick} type="button" data-bs-toggle="collapse" data-bs-target={`#${meetingId}`} aria-expanded="true" aria-controls={meetingId}>
              {meet.title} - Date: {meet.date}, Time: {meet.time}
            </button>
          </h2>
          <div id={meetingId} className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body" >
              {/* <strong>Meeting ID : {meet.id}, Meeting Title : {meet.title}</strong>  */}
              <strong>Meeting ID : {meet.id}, Meeting Title : {meet.title}</strong>
              <p>Time: {meet.time}</p>
              <p>Date: {meet.date}</p>
              <p>Attendees:<br/>
                {meet.attendees.map((attendee, index) => (
                  <li key={index}>{attendee}</li>
                ))}
              </p>
              
              <p>Description:<br/>{meet.Description}</p> 
              <div className='mt-2'>
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
              handleattendees={handleattendees}
              handleDescription={handleDescription}
            />

          }

          {confirmdelete &&

            (<div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Confirmation</h5>
                    <button type="button" className="close" onClick={handleCancelDelete} data-dismiss="modal">
                      <span>&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    Are you sure you want to delete{" "}
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCancelDelete} data-dismiss="modal">
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleConfirmDelete}
                      data-dismiss="modal"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>)
          }
        </div>
      </div>

    </div>
    
  )
}
