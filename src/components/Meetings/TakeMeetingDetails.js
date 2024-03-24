import React from 'react';
import Formelement from './Formelement';
import { useState } from 'react';

export default function TakeMeetingDetails({
  currmeeting,
  handleClose,
  handleSave,
  handletitle,
  handletime,
  handledate,
  handleattendees,
  handleDescription,
  handleBranch,
  handleAllBranchesChange,
  mentees,
  handleMentee,
  role
}) {
  const [formValid, setFormValid] = useState(true);

  const handleButtonSave = (e) => {
    e.stopPropagation();
    if (currmeeting.title && currmeeting.date && currmeeting.time && currmeeting.attendee.length > 0 && currmeeting.description) {
      // If the form is valid, you can create the meeting object
      if(role === "admin"){
        if(currmeeting.attendee.includes("Mentors") && currmeeting.mentorBranches.length === 0){
          setFormValid(false);
        }
        else if(currmeeting.attendee.includes("Mentees") && currmeeting.menteeBranches.length === 0){
          setFormValid(false);
        }
        else{
          handleSave()
        }
      }
      else if(role === "mentor"){
        if(currmeeting.menteeList.length === 0){
          setFormValid(false);
        }
        else{
          handleSave()
        }
      }
      
    } else {
      setFormValid(false);
    }
  };

  return (
    <div>
      <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="modal-dialog" role="document" style={{ maxWidth: '600px' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Schedule Meeting</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Formelement
                currmeeting={currmeeting}
                handledate={handledate}
                handletime={handletime}
                handletitle={handletitle}
                handleDescription={handleDescription}
                formValid={formValid}
                handleBranch={handleBranch}
                handleAllBranchesChange = {handleAllBranchesChange}
                handleattendees={handleattendees}
                mentees = {mentees}
                handleMentee={handleMentee}
                role = {role}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleClose}>
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={handleButtonSave}>
                Save Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
