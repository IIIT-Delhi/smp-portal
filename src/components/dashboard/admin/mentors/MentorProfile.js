import React from "react";

const MentorProfile = ({ mentor, onClose }) => {
  if (!mentor) {
    return null;
  }
  // Function to find mentee details by ID
  // Create a table row for each mentee
  const menteeRows = mentor.menteesToMentors.map((mentee) => {
    // mentee should be an array with id, name, and email
    const [id, name, email] = mentee;

    return (
      <tr key={id}>
        <td>{name}</td>
        <td>{id}</td>
        <td>{email}</td>
      </tr>
    );
  });

  const yearOptions = {
    B3: "3",
    B4: "4",
    M2: "2",
  };
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
              <img
                src={mentor.imgSrc}
                alt="Profile"
                className="img-fluid img-thumbnail mt-4 mb-2"
                style={{ width: "50%", borderRadius: "10%" }}
              />
              <p>Name: {mentor.name}</p>
              <p>Roll Number: {mentor.id}</p>
              <p>Email: {mentor.email}</p>
              <p>Contact Number: {mentor.contact}</p>
              <p>Year: {yearOptions[mentor.year]}</p>
              <p>
                Programme:{mentor.department.startsWith("B") ? "B.Tech" : "M.Tech"}
              </p>
              <p>
                Branch:
                {branchOptions[mentor.department]}
              </p>
              <p>Goodies Status: {mentor.goodiesStatus}</p>
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
            {/* <button type="button" className="btn btn-primary" onClick={onEdit}>
              Edit
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
