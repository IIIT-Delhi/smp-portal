import React from "react";
import departmentOptions from "../../../../data/departmentOptions.json"

const MenteeProfile = ({ mentee, onClose }) => {
  if (!mentee) {
    return null;
  }

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{mentee.name}'s Profile</h5>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div
            className="modal-body"
            style={{
              maxHeight: "70vh",
              overflowY: "scroll",
              maxWidth: "70vw",
              overflowX: "scroll",
            }}
          >
            <div className="row">
              <div className="col-md-6">
                <h6>Mentee:</h6>
                <img
                  src={mentee.imgSrc}
                  alt="Mentee Profile"
                  className="img-fluid img-thumbnail mt-4 mb-2"
                  style={{
                    maxWidth: "400px",
                    maxHeight: "400px",
                    borderRadius: "10%",
                  }}
                />
                {/* Display mentee's profile information here */}
                <p>
                  <b>Name:</b> {mentee.name}
                </p>
                <p>
                  <b>Roll Number:</b> {mentee.id}
                </p>
                <p>
                  <b>Email:</b> {mentee.email}
                </p>
                <p>
                  <b>Contact:</b> {mentee.contact}
                </p>
                <p>
                  <b>Programme:</b>{" "}
                  {mentee.department.startsWith("B") ? "B.Tech" : "M.Tech"}
                </p>
                <p>
                  <b>Department:</b>{" "}
                  {departmentOptions[mentee.department].split(" ")[0]}
                </p>
              </div>
              <div className="col-md-6">
                <h6>Mentor:</h6>
                {mentee.mentorId !== "NULL" ? (
                  <>
                    <img
                      src={mentee.mentorImage}
                      alt="Mentor Profile"
                      className="img-fluid img-thumbnail mt-4 mb-2"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        borderRadius: "10%",
                      }}
                    />
                    {/* Display mentor's profile information here */}
                    <p>
                      <b>Name:</b> {mentee.mentorName}
                    </p>
                    <p>
                      <b>Roll Number:</b> {mentee.mentorId}
                    </p>
                    <p>
                      <b>Email:</b> {mentee.mentorEmail}
                    </p>
                    <p>
                      <b>Contact:</b> {mentee.mentorContact}
                    </p>
                    <p><b>
                      Department:</b> {departmentOptions[mentee.mentorDepartment]}
                    </p>
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