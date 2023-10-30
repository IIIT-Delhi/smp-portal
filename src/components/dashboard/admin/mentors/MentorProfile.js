import React from "react";

const MentorProfile = ({ mentor, onClose, onEdit }) => {
  if (!mentor) {
    return null;
  }

  return (
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{mentor.name}'s Profile</h5>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {/* Display mentor's profile information here */}
            <div>
              <p>Name: {mentor.name}</p>
              <p>Email: {mentor.email}</p>
              {/* Add more mentor profile details here */}
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
            <button type="button" className="btn btn-primary" onClick={onEdit}>
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
