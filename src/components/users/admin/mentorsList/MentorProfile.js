import React from "react";
import yearOptions from "../../../../data/yearOptions.json";
import departmentOptions from "../../../../data/departmentOptions.json";
const MentorProfile = ({ mentor, onClose }) => {
  if (!mentor) {
    return null;
  }

  // Function to find mentee details by ID
  // Create a table row for each mentee
  const menteeRows = mentor.menteesToMentors.map((mentee) => {
    // mentee should be an array with id, name, and email
    const [id, name, email, contact,department] = mentee;

    return (
      <tr key={id}>
        <td>{name}</td>
        <td>{id}</td>
        <td>{email}</td>
        <td>{contact}</td>
        <td>{departmentOptions[department]}</td>
      </tr>
    );
  });

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{mentor.name}'s Profile</h5>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body"
          style={{ maxHeight: "70vh", overflowY: "scroll", maxWidth: "70vw", overflowX: "scroll" }}>
            <div className="row">
              {/* Mentor details column (40%) */}
              <div className="col-md-4">
                <img
                  src={mentor.imgSrc}
                  alt="Profile"
                  className="img-fluid img-thumbnail mt-4 mb-2"
                  style={{ width: "100%", borderRadius: "10%"}}

                />
                <p>Name: {mentor.name}</p>
                <p>Roll Number: {mentor.id}</p>
                <p>Email: {mentor.email}</p>
                <p>Contact Number: {mentor.contact}</p>
                <p>Year: {yearOptions[mentor.year]}</p>
                <p>
                  Programme:{" "}{mentor.department.startsWith("B") ? "B.Tech" : "M.Tech"}
                </p>
                <p>Branch:{ " "} {departmentOptions[mentor.department]}</p>
                {/* <p>Goodies Status: {mentor.goodiesStatus}</p> */}
                {/* Add more mentor profile details here */}
              </div>
              {/* Mentees table column (60%) */}
              <div className="col-md-8">
                <h5>Mentees:</h5>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Roll Number</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>Department</th>
                    </tr>
                  </thead>
                  <tbody>{menteeRows}</tbody>
                </table>
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
