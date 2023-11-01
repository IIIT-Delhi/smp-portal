import React from "react";
import menteesData from "../../../../data/menteeList.json";

const MentorProfile = ({ mentor, onClose, onEdit }) => {
  if (!mentor) {
    return null;
  }
  // Function to find mentee details by ID
  const findMenteeById = (id) => {
    return menteesData.find((mentee) => mentee.id === id);
  };
  // Create a table row for each mentee
  const menteeRows = mentor.menteesToMentors.map((menteeId) => {
    const mentee = findMenteeById(menteeId);
    if (mentee) {
      return (
        <tr key={menteeId}>
          <td>{mentee.name}</td>
          <td>{mentee.id}</td>
          <td>{mentee.email}</td>
        </tr>
      );
    }
    return null;
  });

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
          <div
            className="modal-body"
            style={{ maxHeight: "300px", overflowY: "scroll" }}
          >
            {/* Display mentor's profile information here */}
            <div>
              <p>Name: {mentor.name}</p>
              <p>Roll Number: {mentor.id}</p>
              <p>Email: {mentor.email}</p>
              <p>Department: {mentor.department}</p>
              {/* Add more mentor profile details here */}
            </div>
            <h5>Mentees:</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll Number</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>{menteeRows}</tbody>
            </table>
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
