import Navbar from "../../common/Navbar";
import { useAuth } from "../../../../context/AuthContext";
import React, { useState, useEffect } from "react";
import deleteIcon from "../../../../images/delete_icon.png";
import MentorProfile from "./MentorProfile";

const MentorsList = () => {
  // Dummy data (replace with actual data fetching)
  const { userDetails } = useAuth();
  const [mentors, setMentors] = useState([]);
  // Function to fetch Mentor list from Django endpoint
  const fetchMentorList = async () => {
    try {
      // Make an HTTP GET request to your Django endpoint
      const response = await axios.get("http://127.0.0.1:8000/getAllMentors/"); // Replace with your Django API endpoint

      // Update the state with the fetched Mentor list
      setMentors(response.data);
      console.log(mentees);
    } catch (error) {
      console.error("Error fetching Mentor list:", error);
    }
  };

  // Call the function to fetch the Mentor list when the component loads
  useEffect(() => {
    fetchMentorList();
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [mentorToDelete, setMentorToDelete] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);

  // Define the fixed widths for the header columns
  const headerColumnWidths = {
    name: "30%",
    id: "20%",
    department: "30%",
    actions: "20%",
  };

  const headerColumns = [
    { label: "Name", key: "name" },
    { label: "Roll Number", key: "id" },
    { label: "Department", key: "department" },
    { label: "Actions", key: "actions" },
  ];

  const openMentorProfile = (mentor) => {
    setSelectedMentor(mentor);
  };

  const closeMentorProfile = () => {
    setSelectedMentor(null);
  };

  // Function to handle deletion confirmation
  const handleDeleteConfirmation = (mentor) => {
    setMentorToDelete(mentor);
  };

  // Function to delete a mentor
  const handleDeleteMentor = () => {
    if (mentorToDelete) {
      // Perform mentor deletion logic (API call or other)
      // Update the mentors list after successful deletion
      axios
        .post("http://127.0.0.1:8000/deleteMentorById/", mentorToDelete.id)
        .then((response) => {
          // If the backend successfully deletes the meeting, update your local state
          if (response.status === 200) {
            setMentors((prevMentors) =>
              prevMentors.filter((mentor) => mentor.id !== mentorToDelete.id)
            );
            setMentorToDelete(null); // Clear the mentor to delete
          }
        })
        .catch((error) => {
          console.error("Error deleting meeting:", error);
        });
    }
  };

  // Function to cancel the mentor deletion
  const handleCancelDelete = () => {
    setMentorToDelete(null); // Clear the mentor to delete
  };

  const editMentorProfile = () => {
    console.log(`Edit Clicked for ${selectedMentor.name}`);
  };

  return (
    <div>
      <Navbar className="fixed-top" />
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
        <div className="table-container text-left">
          <div className="table-headers">
            <table className="table mt-4 mx-2" border="1">
              <thead>
                <tr>
                  {headerColumns.map((column) => (
                    <th
                      key={column.key}
                      style={{ width: headerColumnWidths[column.key] }}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>
          <div
            className="table-body"
            style={{ maxHeight: "250px", overflowY: "scroll" }}
          >
            <table className="table table-hover mb-4 mx-2" border="1">
              <tbody>
                {mentors
                  .filter((mentor) =>
                    mentor.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((mentor) => (
                    <tr
                      className=""
                      key={mentor.id}
                      // onClick={() => openMentorProfile(mentor)}
                      style={{ cursor: "pointer" }}
                    >
                      <td
                        style={{
                          width: headerColumnWidths["name"],
                        }}
                      >
                        <button
                          className="btn btn-link"
                          onClick={() => openMentorProfile(mentor)}
                        >
                          {mentor.name}
                        </button>
                      </td>
                      <td
                        style={{
                          width: headerColumnWidths["id"],
                        }}
                      >
                        {mentor.id}
                      </td>
                      <td
                        style={{
                          width: headerColumnWidths["department"],
                        }}
                      >
                        {mentor.department}
                      </td>
                      <td
                        style={{
                          width: headerColumnWidths["actions"],
                        }}
                      >
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
            {/* Mentor Profile Popup */}
            {selectedMentor && (
              <div
                className="modal fade show"
                style={{ display: "block" }}
                tabIndex="-1"
                role="dialog"
                aria-labelledby="mentorProfilePopup"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <MentorProfile
                    mentor={selectedMentor}
                    onClose={closeMentorProfile}
                    onEdit={editMentorProfile}
                  />
                </div>
              </div>
            )}
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
