import Navbar from "../../common/Navbar";
import { useAuth } from "../../../../context/AuthContext";
import React, { useState, useEffect } from "react";
import deleteIcon from "../../../../images/delete_icon.png";
import axios from "axios"; // Import Axios
import MentorProfile from "./MentorProfile";

const MentorsList = () => {
  // Dummy data (replace with actual data fetching)
  // const { userDetails } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState("");
  const [totalEntries, setTotalEntries] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [mentorToDelete, setMentorToDelete] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [uniqueTotalMentees, setUniqueTotalMentees] = useState([]);
  const [selectedTotalMenteesFilter, setSelectedTotalMenteesFilter] =
    useState("");

  const departmentOptions = {
    "B-CSB": "CSB (B.Tech.)",
    "B-CSSS": "CSSS (B.Tech.)",
    "B-CSD": "CSD (B.Tech.)",
    "B-CSE": "CSE (B.Tech.)",
    "B-CSAI": "CSAI (B.Tech.)",
    "B-CSAM": "CSAM (B.Tech.)",
    "B-ECE": "ECE (B.Tech.)",
    "B-EVE": "EVE (B.Tech.)",
    "M-CSE": "CSE (M.Tech.)",
    "M-ECE": "ECE (M.Tech.)",
    "M-CB": "CB (M.Tech.)",
  };


  // Function to fetch Mentor list from Django endpoint
  const fetchMentorList = async () => {
    try {
      // Make an HTTP GET request to your Django endpoint
      const response = await axios.get("http://127.0.0.1:8000/getAllMentors/"); // Replace with your Django API endpoint

      // Update the state with the fetched Mentor list
      setMentors(response.data);
      setTotalEntries(response.data.length);
    } catch (error) {
      console.error("Error fetching Mentor list:", error);
    }
  };

  // Call the function to fetch the Mentor list when the component loads
  useEffect(() => {
    fetchMentorList();
  }, []);

  useEffect(() => {
    // Extract unique values of "Total Mentees"
    const uniqueValues = [
      ...new Set(mentors.map((mentor) => mentor.menteesToMentors.length)),
    ];
    setUniqueTotalMentees(uniqueValues);
  }, [mentors]);

  const filteredMentors = mentors.filter((mentor) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const lowerName = mentor.name.toLowerCase();
    const lowerId = mentor.id.toLowerCase();
    const departmentLabel = departmentOptions[mentor.department] || "";
    const lowerDepartment = departmentLabel.toLowerCase();

    // Apply department filter
    const isDepartmentFiltered =
      !selectedDepartmentFilter ||
      mentor.department === selectedDepartmentFilter;

    // Apply Total Mentees filter
    const isTotalMenteesFiltered =
      !selectedTotalMenteesFilter ||
      mentor.menteesToMentors.length === +selectedTotalMenteesFilter;

    return (
      isDepartmentFiltered &&
      isTotalMenteesFiltered &&
      (lowerName.includes(lowerSearchTerm) ||
        lowerId.includes(lowerSearchTerm) ||
        lowerDepartment.includes(lowerSearchTerm))
    );
  });

  useEffect(() => {
    // Update filtered total entries when filteredMentors change
    setTotalEntries(filteredMentors.length);
  }, [filteredMentors]);

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
        .post(
          "http://127.0.0.1:8000/deleteMentorById/",
          JSON.stringify({ id: mentorToDelete.id })
        )
        .then((response) => {
          // If the backend successfully deletes the meeting, update your local state
          if (response.status === 200) {
            // setMentors((prevMentors) =>
            //   prevMentors.filter((mentor) => mentor.id !== mentorToDelete.id)
            // );
            setMentorToDelete(null); // Clear the mentor to delete
            const confirmLogout = window.confirm(response.data.message);
            fetchMentorList();
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
          <p>Total Entries: {totalEntries}</p>
        </div>
        <div className="input-group my-3">
          {/* Search Mentors input */}
          <input
            type="text"
            className="form-control"
            placeholder="Search Mentors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Department filter dropdown */}
          <div className="input-group-append mx-2">
            <select
              className="form-control"
              value={selectedDepartmentFilter}
              onChange={(e) => setSelectedDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {Object.keys(departmentOptions).map((department) => (
                <option key={department} value={department}>
                  {departmentOptions[department]}
                </option>
              ))}
            </select>
          </div>

          {/* Total Mentees filter dropdown */}
          <div className="input-group-append">
            <select
              className="form-control"
              value={selectedTotalMenteesFilter}
              onChange={(e) => setSelectedTotalMenteesFilter(e.target.value)}
            >
              <option value="">All Total Mentees</option>
              {uniqueTotalMentees.map((totalMentees) => (
                <option key={totalMentees} value={totalMentees}>
                  {totalMentees}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="table-container text-center my-2"
          style={{ overflow: "auto", maxHeight: "400px" }}
        >
          <div className="table-body">
            <table
              className="table table-bordered table-hover mb-4 mx-2"
              border="1"
            >
              <thead
                style={{
                  position: "sticky",
                  top: "0",
                  backgroundColor: "white",
                  zIndex: "1",
                }}
              >
                <tr>
                  {headerColumns.map((column) => (
                    <th key={column.key}>{column.label}</th>
                  ))}
                  <th>Mentees</th>
                </tr>
              </thead>
              <tbody>
                {filteredMentors.map((mentor) => (
                  <tr
                    className=""
                    key={mentor.id}
                    // onClick={() => openMentorProfile(mentor)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <button
                        className="btn btn-link"
                        onClick={() => openMentorProfile(mentor)}
                      >
                        {mentor.name}
                      </button>
                    </td>
                    <td>{mentor.id}</td>
                    <td>{departmentOptions[mentor.department]}</td>
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
                    <td>{mentor.menteesToMentors.length}</td>
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
                    departmentOptions={departmentOptions}
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
