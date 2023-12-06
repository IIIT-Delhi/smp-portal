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
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{mentee.name}'s Profile</h5>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body"
          style={{ maxHeight: "70vh", overflowY: "scroll", maxWidth: "70vw", overflowX: "scroll" }}>
            <div className="row">
              <div className="col-md-6">
                <h6>Mentee:</h6>
                <img
                  src={mentee.imgSrc}
                  alt="Mentee Profile"
                  className="img-fluid img-thumbnail mt-4 mb-2"
                  style={{ maxWidth: "400px", maxHeight: "400px", borderRadius: "10%" }}
                />
                {/* Display mentee's profile information here */}
                <p>Name: {mentee.name}</p>
                <p>Roll Number: {mentee.id}</p>
                <p>Email: {mentee.email}</p>
                <p>Contact: {mentee.contact}</p>
                <p>
                  Programme:
                  {mentee.department.startsWith("B") ? "B.Tech" : "M.Tech"}
                </p>
                <p>
                  Branch:
                  {branchOptions[mentee.department]}
                </p>
              </div>
              <div className="col-md-6">
                <h6>Mentor:</h6>
                {mentee.mentorId !== 'NULL' ? (
                  <>
                    <img
                      src={mentee.mentorImage}
                      alt="Mentor Profile"
                      className="img-fluid img-thumbnail mt-4 mb-2"
                      style={{ maxWidth: "200px", maxHeight: "200px", borderRadius: "10%" }}
                    />
                    {/* Display mentor's profile information here */}
                    <p>Mentor Name: {mentee.mentorName}</p>
                    <p>Mentor Roll Number: {mentee.mentorId}</p>
                    <p>Mentor Email: {mentee.mentorEmail}</p>
                    <p>Mentor Contact: {mentee.mentorContact}</p>
                    {/* Add other mentor profile details */}
                  </>
                ) : (
                  <p>Mentor: Not Assigned</p>
                )}
              </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeProfile;