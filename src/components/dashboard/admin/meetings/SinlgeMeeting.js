import React from 'react'
import { useState } from 'react';
import TakeMeetingDetails from './TakeMeetingDetails';

export default function SinlgeMeeting({ meet, ondelete, editMeeting, userDetails, isPreviousMeeting}) {
  const handleButtonClick = (e) => {
    e.stopPropagation();
  };

  const meetingId = `meeting-${meet.meetingId}`;

  const [isEditing, setIsEditing] = useState(false);

  const [confirmdelete, setconfirmdelete] = useState(false);

  const [editedMeeting, setEditedMeeting] = useState(meet);

  const handleEditClick = () => {
    // Add your edit functionality here
    setIsEditing(true);
    console.log("Edit clicked for meeting ID:", meet.meetingId);
  };

  const handleEditSave = () => {
    editMeeting(meet.meetingId, editedMeeting);
    setIsEditing(false);
  };

  const handleEditClose = () => {
    setEditedMeeting(meet);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    // Add your delete functionality here
    setconfirmdelete(true);
    // console.log('Delete clicked for meeting ID:', meet.meetingId);
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

  const handleattendee = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    setEditedMeeting((prevDetails) => {
      const updatedattendee = isChecked
        ? [...prevDetails.attendee, value]
        : prevDetails.attendee.filter((attendee) => attendee !== value);

      return {
        ...prevDetails,
        attendee: updatedattendee,
      };
    });
  };

  const handleDescription = (e) => {
    setEditedMeeting({
      ...editedMeeting,
      description: e.target.value,
    });
  };

  const handleCancelDelete = () => {
    setconfirmdelete(false);
  };

  const handleConfirmDelete = () => {
    ondelete(meet.meetingId);
    setconfirmdelete(false);
  };

  const getAttendeeLabel = (attendee) => {
    switch (attendee) {
      case 1:
        return 'Mentors';
      case 2:
        return 'Mentees';
      case 3:
        return 'Mentors and Mentees';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="mb-2" style={{ width: "100%" }}>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button btn-sm collapsed"
              onClick={handleButtonClick}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#${meetingId}`}
              aria-expanded="true"
              aria-controls={meetingId}
            >
              {meet.title} - Date: {meet.date}, Time: {meet.time}
            </button>
          </h2>
          <div
            id={meetingId}
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              {/* <strong>Meeting ID : {meet.meetingId}, Meeting Title : {meet.title}</strong>  */}
              <strong>
                Meeting ID : {meet.meetingId}, Meeting Title : {meet.title}
              </strong>
              <p>Time: {meet.time}</p>
              <p>Date: {meet.date}</p>
              <p>
                Attendee:
                <br />
                {Array.isArray(meet.attendee) ? (
                  meet.attendee.map((attendee, index) => (
                    <li key={index}>{getAttendeeLabel(attendee)}</li>
                  ))
                ) : (
                  <li>{getAttendeeLabel(meet.attendee)}</li>
                )}
              </p>

              <p>
                Description:
                <br />
                {meet.description}
              </p>

              <div className="mt-2">
                <button
                  className="btn btn-danger mx-2"
                  onClick={handleDeleteClick}
                >
                  Delete
                </button>
                {!isPreviousMeeting && (
                  <button
                    className="btn btn-primary mx-2"
                    onClick={handleEditClick}
                  >
                    Edit
                  </button>
                )}
              </div>

            </div>
          </div>

          {isEditing && (
            <TakeMeetingDetails
              currmeeting={editedMeeting}
              handleClose={handleEditClose}
              handleSave={handleEditSave}
              handledate={handledate}
              handletime={handletime}
              userDetails={userDetails}
              handletitle={handletitle}
              handleattendee={handleattendee}
              handleDescription={handleDescription}
            />
          )}

          {confirmdelete && (
            <div
              className="modal"
              style={{
                display: "block",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Confirmation</h5>
                    <button
                      type="button"
                      className="close"
                      onClick={handleCancelDelete}
                      data-dismiss="modal"
                    >
                      <span>&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    Are you sure you want to delete{" "}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancelDelete}
                      data-dismiss="modal"
                    >
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
