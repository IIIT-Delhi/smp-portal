import Navbar from "../../common/Navbar";
import { useAuth } from "../../../../context/AuthContext";
import React, { useState, useEffect } from "react";
import deleteIcon from "../../../../images/delete_icon.png";
import MentorProfile from "./MentorProfile";
import mentorList from "../../../../data/mentorList.json";

const MentorsList = () => {
  // Dummy data (replace with actual data fetching)
  const { userDetails } = useAuth();
  const [mentors, setMentors] = useState([]);
  useEffect(() => {
    async function fetchMentorsData() {
      try {
        setMentors(mentorList);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }

    fetchMentorsData();
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [mentorToDelete, setMentorToDelete] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);

  // State for controlling the "Add Mentor" pop-up
  const [addMentorModalVisible, setAddMentorModalVisible] = useState(false);

  // State for mentor form fields
  const [mentorForm, setMentorForm] = useState({
    name: "",
    id: "",
    department: "",
    email: "",
    menteesToMentors: [],
  });
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

  const editMentorProfile = () => {
    console.log(`Edit Clicked for ${selectedMentor.name}`);
  };

  // Function to handle the form submission when adding a mentor
  const handleAddMentor = () => {
    // Form validation
    if (
      !mentorForm.name || // Check if name is empty
      !mentorForm.id || // Check if roll number is empty
      !mentorForm.department || // Check if department is empty
      !mentorForm.email || // Check if email is empty
      !mentorForm.menteesToMentors // Check if menteesToMentors is empty
    ) {
      // You can display an error message or handle validation as needed
      console.error("Please fill in all required fields.");
      return;
    }

    // Add the mentor to the list
    setMentors([...mentors, mentorForm]);

    // Clear the form and close the modal
    setMentorForm({
      name: "",
      id: "",
      department: "",
      email: "",
      menteesToMentors: [],
    });
    setAddMentorModalVisible(false);
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
        <button
          className="btn btn-primary mx-2"
          onClick={() => setAddMentorModalVisible(true)}
        >
          Add Mentor
        </button>
        <div
          className={`modal ${addMentorModalVisible ? "show" : ""}`}
          tabIndex="-1"
          role="dialog"
          style={{ display: addMentorModalVisible ? "block" : "none" }}
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Mentor</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setAddMentorModalVisible(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {/* Mentor Form */}
                <form onSubmit={handleAddMentor}>
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={mentorForm.name}
                      onChange={(e) =>
                        setMentorForm({ ...mentorForm, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Roll Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={mentorForm.id}
                      onChange={(e) =>
                        setMentorForm({ ...mentorForm, id: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={mentorForm.email}
                      onChange={(e) =>
                        setMentorForm({ ...mentorForm, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Department *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={mentorForm.department}
                      onChange={(e) =>
                        setMentorForm({
                          ...mentorForm,
                          department: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Mentees Assigned (comma separated roll numbers)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={mentorForm.menteesToMentors}
                      onChange={(e) =>
                        setMentorForm({
                          ...mentorForm,
                          menteesToMentors: e.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter((item) => item.length > 0),
                        })
                      }
                    />
                  </div>

                  {/* Add other form fields (Roll Number, Department, Email, Mentor Name, Mentor Email) here */}

                  <button type="submit" className="btn btn-primary">
                    Add
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <button className="btn btn-primary mx-2">Upload CSV</button>
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
