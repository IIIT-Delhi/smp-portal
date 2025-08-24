import React, { useState, useEffect } from "react";
import yearOptions from "../../../../data/yearOptions.json";
import departmentOptions from "../../../../data/departmentOptions.json";

const MentorProfile = ({ mentor, onClose }) => {
  const [remarks, setRemarks] = useState("");
  const [newRemarks, setNewRemarks] = useState("");

  useEffect(() => {
    if (mentor) {
      fetch(`http://localhost:8000/api/${mentor.id}/getMentorRemarks/`)
        .then((response) => {
          console.log(response);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.remarks) {
            setRemarks(data.remarks);
            setNewRemarks(data.remarks); // Pre-populate the textarea with existing remarks
          }
        })
        .catch((error) => {
          console.error('Error fetching remarks:', error);
          // Optionally, display an error message to the user
        });
    }
  }, [mentor]);


  const saveRemarks = async () => {
    try {
      console.log("save")
      const response = await fetch(`http://localhost:8000/api/${mentor.id}/saveMentorRemarks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ remarks: newRemarks }),
      });

      if (response.ok) {
        alert('Remarks saved successfully!');
        setRemarks(newRemarks);
        // Keep the saved remarks in the textarea instead of clearing
      } else {
        alert('Failed to save remarks');
      }
    } catch (error) {
      console.error('Error saving remarks:', error);
      alert('An error occurred while saving remarks');
    }
  };

  if (!mentor) {
    return null;
  }

  const menteeRows = mentor.menteesToMentors.map((mentee) => {
    const [id, name, email, contact, department] = mentee;

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
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{mentor.name}'s Profile</h5>
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
            <div className="row ">
              <div className="col-md-4">
                <img
                  src={mentor.imgSrc}
                  alt="Profile"
                  className="img-fluid img-thumbnail mt-4 mb-2"
                  style={{ width: "100%", borderRadius: "10%" }}
                />
                <p>
                  <b>Name:</b> {mentor.name}
                </p>
                <p>
                  <b>Roll Number:</b> {mentor.id}
                </p>
                <p>
                  <b>Email:</b> {mentor.email}
                </p>
                <p>
                  <b>Contact Number:</b> {mentor.contact}
                </p>
                <p>
                  <b>Year:</b> {mentor.year[1]}
                </p>
                <p>
                  <b>Programme:</b>{" "}
                  {mentor.department.startsWith("B") ? "B.Tech" : "M.Tech"}
                </p>
                <p>
                  <b>Department:</b>{" "}
                  {departmentOptions[mentor.department].split(" ")[0]}
                </p>
              </div>
              <div className="col-md-8">
                <h5>Mentees:</h5>
                <table className="table table-hover">
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
                <div>
                  <h5>Remarks:</h5>
                  <textarea
                    value={newRemarks}
                    onChange={(e) => setNewRemarks(e.target.value)}
                    className="form-control"
                    rows="5"
                    placeholder="Add or edit remarks here"
                  ></textarea>
                  <button
                    onClick={saveRemarks}
                    className="btn btn-primary mt-2"
                  >
                    Save Remarks
                  </button>
                </div>
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

export default MentorProfile;
