import Navbar from "../../common/Navbar";
import { useAuth } from "../../../../context/AuthContext";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import deleteIcon from "../../../../images/delete_icon.png";

const MentorsList = () => {
  // Dummy data (replace with actual data fetching)
  const { userDetails } = useAuth();
  const dummyMentorsData = [
    { id: 1, name: "Mentor 1", email: "mentor1@example.com" },
    { id: 2, name: "Mentor 2", email: "mentor2@example.com" },
    { id: 3, name: "Mentor 3", email: "mentor3@example.com" },
    { id: 4, name: "Mentor 4", email: "mentor4@example.com" },
    { id: 5, name: "Mentor 5", email: "mentor5@example.com" },
    { id: 1, name: "Mentor 1", email: "mentor1@example.com" },
    { id: 2, name: "Mentor 2", email: "mentor2@example.com" },
    { id: 3, name: "Mentor 3", email: "mentor3@example.com" },
    { id: 4, name: "Mentor 4", email: "mentor4@example.com" },
    { id: 5, name: "Mentor 5", email: "mentor5@example.com" },
    { id: 1, name: "Mentor 1", email: "mentor1@example.com" },
    { id: 2, name: "Mentor 2", email: "mentor2@example.com" },
    { id: 3, name: "Mentor 3", email: "mentor3@example.com" },
    { id: 4, name: "Mentor 4", email: "mentor4@example.com" },
    { id: 5, name: "Mentor 5", email: "mentor5@example.com" },
    { id: 1, name: "Mentor 1", email: "mentor1@example.com" },
    { id: 2, name: "Mentor 2", email: "mentor2@example.com" },
    { id: 3, name: "Mentor 3", email: "mentor3@example.com" },
    { id: 4, name: "Mentor 4", email: "mentor4@example.com" },
    { id: 5, name: "Mentor 5", email: "mentor5@example.com" },
    { id: 1, name: "Mentor 1", email: "mentor1@example.com" },
    { id: 2, name: "Mentor 2", email: "mentor2@example.com" },
    { id: 3, name: "Mentor 3", email: "mentor3@example.com" },
    { id: 4, name: "Mentor 4", email: "mentor4@example.com" },
    { id: 5, name: "Mentor 5", email: "mentor5@example.com" },
    { id: 1, name: "Mentor 1", email: "mentor1@example.com" },
    { id: 2, name: "Mentor 2", email: "mentor2@example.com" },
    { id: 3, name: "Mentor 3", email: "mentor3@example.com" },
    { id: 4, name: "Mentor 4", email: "mentor4@example.com" },
    { id: 5, name: "Mentor 5", email: "mentor5@example.com" },
    { id: 1, name: "Mentor 1", email: "mentor1@example.com" },
    { id: 2, name: "Mentor 2", email: "mentor2@example.com" },
    { id: 3, name: "Mentor 3", email: "mentor3@example.com" },
    { id: 4, name: "Mentor 4", email: "mentor4@example.com" },
    { id: 5, name: "Mentor 5", email: "mentor5@example.com" },
    { id: 1, name: "Mentor 1", email: "mentor1@example.com" },
    { id: 2, name: "Mentor 2", email: "mentor2@example.com" },
    { id: 3, name: "Mentor 3", email: "mentor3@example.com" },
    { id: 4, name: "Mentor 4", email: "mentor4@example.com" },
    { id: 5, name: "Mentor 5", email: "mentor5@example.com" },
    // Add more mentors as needed
  ];

  const [mentors, setMentors] = useState(dummyMentorsData); // Initialize with dummy data
  const [searchTerm, setSearchTerm] = useState("");
  const [mentorToDelete, setMentorToDelete] = useState(null);

  // Function to handle deletion confirmation
  const handleDeleteConfirmation = (mentor) => {
    setMentorToDelete(mentor);
  };

  // Function to delete a mentor
  const handleDeleteMentor = () => {
    if (mentorToDelete) {
      // Perform mentor deletion logic (API call or other)
      // Update the mentors list after successful deletion
      setMentors((prevMentors) =>
        prevMentors.filter((mentor) => mentor.id !== mentorToDelete.id)
      );
      setMentorToDelete(null); // Clear the mentor to delete
    }
  };

  // Function to cancel the mentor deletion
  const handleCancelDelete = () => {
    setMentorToDelete(null); // Clear the mentor to delete
  };

  return (
    <div>
      <Navbar userDetails={userDetails} />
      <div className="container">
        <div className="text-center my-3">
          <h4>Mentors List</h4>
        </div>
        <div className="input-group my-3">
          <input
            type="text"
            className="form-control mx-2"
            placeholder="Search Mentors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="input-group-append mx-2">
            <button className="btn btn-outline-secondary" type="button">
              Search
            </button>
          </div>
        </div>
        <button className="btn btn-primary mx-2">Add Mentor</button>
        <button className="btn btn-primary mx-2">Upload CSV</button>
        <div className="table-container">
          <div className="table-headers">
            <table className="table mt-4 mx-2" border="1">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
            </table>
          </div>
          <div
            className="table-body"
            style={{ maxHeight: "250px", overflowY: "scroll" }}
          >
            <table className="table mb-4 mx-2" border="1">
              <tbody>
                {mentors
                  .filter((mentor) =>
                    mentor.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((mentor) => (
                    <tr key={mentor.id}>
                      <td>
                        <Link to={`/dashboard/admin/mentors/${mentor.id}`}>
                          {mentor.name}
                        </Link>
                      </td>
                      <td>{mentor.email}</td>
                      <td>
                        <button
                          className="btn btn-sm"
                          onClick={() => handleDeleteConfirmation(mentor)}
                        >
                          <img
                            src={deleteIcon}
                            alt="Delete"
                            style={{ width: "20px", height: "20px" }}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div
          className="modal"
          style={{ display: mentorToDelete ? "block" : "none" }}
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
                {mentorToDelete ? mentorToDelete.name : ""}?
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
                  onClick={handleDeleteMentor}
                  data-dismiss="modal"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorsList;

// export default function MentorsList() {
//   const { userDetails } = useAuth();
//   return (
//     <div>
//       <Navbar userDetails={userDetails} />
//       <div className="container mt-4">
//         <div className="row">
//           <div className="col-12">
//             <div>
//               {/* Include profile information specific to Mentors */}
//               <h4>Admin Mentors List</h4>
//               <p>
//                 <strong>Role:</strong> {userDetails.role}
//               </p>
//               <p>
//                 <strong>Email:</strong> {userDetails.email}
//               </p>
//               {/* Other Mentor-specific content */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
