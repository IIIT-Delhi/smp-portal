import React from "react";

const MenteeProfile = ({ mentee, onClose }) => {
  if (!mentee) {
    return null;
  }
  const branchOptions = {
    "B-CSB": "CSB",
    "B-CSSS": "CSSS",
    "B-CSD": "CSD",
    "B-CSE": "CSE",
    "B-CSAI": "CSAI",
    "B-CSAM": "CSAM",
    "B-ECE": "ECE",
    "B-EVE": "EVE",
    "M-CSE": "CSE",
    "M-ECE": "ECE",
    "M-CB": "CB",
  };

  return (
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{mentee.name}'s Profile</h5>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {/* Display mentee's profile information here */}
            <div>
              <p>Name: {mentee.name}</p>
              <p>Roll Number: {mentee.id}</p>
              <p>Email: {mentee.email}</p>
              <p>
                Programme:
                {mentee.department.startsWith("B") ? "B.Tech" : "M.Tech"}
              </p>
              <p>
                Branch:
                {branchOptions[mentee.department]}
              </p>
              <p>Mentor Name: {mentee.mentorName}</p>
              <p>Mentor Email: {mentee.mentorEmail}</p>
              <p>Mentor Roll Number: {mentee.mentorId}</p>
              {/* Add more mentee profile details here */}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            {/* <button type="button" className="btn btn-primary" onClick={onEdit}>
              Edit
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeProfile;
