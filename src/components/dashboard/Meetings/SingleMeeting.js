import React from 'react'
import { useState } from 'react';
import TakeMeetingDetails from './TakeMeetingDetails';
import Attendance from './Attendance';
import departmentOptions from "../../../data/departmentOptions.json";

export default function SinlgeMeeting({ meet, ondelete, editMeeting, userDetails, isPreviousMeeting, mentees}) {
  const handleButtonClick = (e) => {
    e.stopPropagation();
  };

  const meetingId = `meeting-${meet.meetingId}`;

  const [isEditing, setIsEditing] = useState(false);
  const [confirmdelete, setconfirmdelete] = useState(false);
  const [editedMeeting, setEditedMeeting] = useState(meet);
  const [showAttendance, setshowAttendance] = useState(false);
  const [viewAttendance, setviewAttendance] = useState(false);


  const handleEditClick = () => {
    // Add your edit functionality here
    if(userDetails.role === 'mentor'){
      const updatedMenteeList = meet.menteeList.map(mentee => mentee.id);

      // Updating only the menteelist key inside editedMeeting with the updated array of IDs
      setEditedMeeting(prevState => ({
        ...prevState,
        menteeList: updatedMenteeList
      }));
    }
    setIsEditing(true);
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

  const handleattendees = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    setEditedMeeting((prevDetails) => {
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

  const handleBranch = (e,val) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    setEditedMeeting((prevDetails) => {
      if (isChecked) {
        return val === "Mentor" ? {
          ...prevDetails,
          mentorBranches: [...prevDetails.mentorBranches, value],
        } : {
          ...prevDetails,
          menteeBranches: [...prevDetails.menteeBranches, value],
        }
      } else {
        return val === "Mentor" ? {
          ...prevDetails,
          mentorBranches: prevDetails.mentorBranches.filter(
            (mentorBranches) => mentorBranches !== value
          )
        } : {
          ...prevDetails,
          menteeBranches: prevDetails.menteeBranches.filter(
            (menteeBranches) => menteeBranches !== value
          )
        }
      }
    });
  }

  const handleAllBranchesChange = (e,val) => {
    const isChecked = e.target.checked;
    const allBranches = Object.keys(departmentOptions);
  
    setEditedMeeting((prevDetails) => {
      if (isChecked) {
        // If "All Branches" is checked, set mentorBranches to all branch keys
        return val === "Mentor" ? {
          ...prevDetails,
          mentorBranches: allBranches,
        } : {
          ...prevDetails,
          menteeBranches: allBranches,
        }
      } else {
        // Set mentorBranches to an empty array if no individual branch is selected
        return val === "Mentor" ? {
          ...prevDetails,
          mentorBranches: [],
        } : {
          ...prevDetails,
          menteeBranches: [],
        }
      }
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

  const handleShowAttendance = () => {
    setshowAttendance(true)
  }

  const handleCloseAttendance= () => {
    setshowAttendance(false)
  }

  const handleSaveAttendance = () => {
    setshowAttendance(false)
  }

  const handleViewAttendance = () => {
    setviewAttendance(true)
  }

  const handleCloseViewAttendance= () => {
    setviewAttendance(false)
  }

  const handleMentee = (e) => {
    let value = e.target.value
    let isChecked = e.target.checked
    
    setEditedMeeting((prevDetails) => {
        if(isChecked){
            return {
                ...editedMeeting,
                menteeList : [...prevDetails.menteeList, value]
            }
        }
        else{
            return{
                ...editedMeeting,
                menteeList : prevDetails.menteeList.filter(
                    (mentee) => mentee !== value
                )
            }
        }
    })
  }

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
            {/* <button> hello </button> */}
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
                    <li key={index}>{attendee}</li>
                  ))
                ) : (
                  <li>{meet.attendee}</li>
                )}
              </p>
                {meet.attendee.includes("Mentors") && (
                  <>
                  <>Mentor Branches:</>
                  </>
                )}
                <p>
                  {Array.isArray(meet.mentorBranches) ? (
                    meet.mentorBranches.map((branch, index) => (
                      // <li key={index}>{departmentOptions[branch]}</li>
                      <span key={index}>
                        {departmentOptions[branch]}
                        {index < meet.mentorBranches.length - 1 && ', '}
                      </span>
                    ))
                  ) : (
                    // <li>{meet.mentorBranches}</li>
                    <span>{meet.mentorBranches}</span>
                  )}
                </p>

                {(meet.attendee.includes("Mentees") && meet.menteeList.length ===0) ? (
                  <>Mentee Branches:</>
                ) : meet.menteeList.length !==0 && (
                  <>Name of the Mentees:</>
                )}

                <p>
                  {Array.isArray(meet.menteeBranches) ? (
                    meet.menteeBranches.map((branch, index) => (
                      // <li key={index}>{departmentOptions[branch]}</li>
                      <span key={index}>
                        {departmentOptions[branch]}
                        {index < meet.menteeBranches.length - 1 && ', '}
                      </span>
                    ))
                  ) : (
                    // <li>{meet.mentorBranches}</li>
                    <span>{meet.menteeBranches}</span>
                  )}
                  {Array.isArray(meet.menteeList) ? (
                    meet.menteeList
                      .map((mentee, index) => (
                        <span key={index}>
                          {mentee.name}
                          {index < meet.menteeList.length - 1 && ', '}
                        </span>
                      ))
                  ) : (
                    <span>{meet.menteeList}</span>
                  )}
                </p>

              <p>
                Description:
                <br />
                {meet.description}
              </p>

              <div className="mt-2">
                {!isPreviousMeeting && (userDetails.id === meet.schedulerId ) && (
                  <button
                    className="btn btn-danger mx-2"
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </button>
                )}
                {!isPreviousMeeting && (userDetails.id === meet.schedulerId) && (
                  <button
                    className="btn btn-primary mx-2"
                    onClick={handleEditClick}
                  >
                    Edit
                  </button>
                )}
                {(meet.schedulerId === userDetails.id) && ( 
                <button
                    className="btn btn-primary mx-2"
                    onClick={handleShowAttendance}
                  >
                    Take Attendance
                </button>
                )}
                  
                <button
                    className="btn btn-primary mx-2"
                    onClick={handleViewAttendance}
                >
                    View Attendance
                </button>

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
              handletitle={handletitle}
              handleattendees={handleattendees}
              handleDescription={handleDescription}
              handleBranch={handleBranch}
              handleAllBranchesChange={handleAllBranchesChange}
              handleMentee = {handleMentee}
              mentees = {mentees}
              role = {userDetails.role}
            />
          )}

          {showAttendance && (

            <Attendance
              handleClose={handleCloseAttendance}
              handleButtonSave = {handleSaveAttendance}
              meetingId = {meet.meetingId}
              type = "take"
            />

          )}

          {viewAttendance && (

          <Attendance
            handleClose={handleCloseViewAttendance}
            meetingId = {meet.meetingId}
            type = "view"
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
