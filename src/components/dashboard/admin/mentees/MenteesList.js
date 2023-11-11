import Navbar from "../../common/Navbar";
import { useAuth } from "../../../../context/AuthContext";
import React, { useState, useEffect } from "react";
import deleteIcon from "../../../../images/delete_icon.png";
import MenteeProfile from "./MenteeProfile";
import MenteeUpload from "./MenteeUpload";
import axios from "axios";

const MenteesList = () => {
  // Dummy data (replace with actual data fetching)
  const { userDetails } = useAuth();
  const [mentees, setMentees] = useState([]);
  const[isFirstTime,setisFirstTime] = useState(true);

  // Function to fetch Mentee list from Django endpoint
  const fetchMenteeList = async () => {
    try {
      // Make an HTTP GET request to your Django endpoint
      const response = await axios.get("http://127.0.0.1:8000/getAllMentees/"); // Replace with your Django API endpoint

      // Update the state with the fetched Mentee list
      setMentees(response.data);
      console.log(mentees);
    } catch (error) {
      console.error("Error fetching Mentee list:", error);
    }
  };

  // Call the function to fetch the Mentee list when the component loads
  useEffect(() => {
    if(isFirstTime){setisFirstTime(false);fetchMenteeList();}
  }, [isFirstTime]);
  const [searchTerm, setSearchTerm] = useState("");
  const [menteeToDelete, setMenteeToDelete] = useState(null);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [menteeUploadCSV, setmenteeUploadCSV] = useState(false);

  // State for controlling the "Add Mentee" pop-up
  const [addMenteeModalVisible, setAddMenteeModalVisible] = useState(false);
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
  // State for mentee form fields
  const [menteeForm, setMenteeForm] = useState({
    name: "",
    id: "",
    department: "",
    email: "",
    mentorName: "",
    mentorEmail: "",
    mentorId: "",
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

  const openMenteeProfile = (mentee) => {
    setSelectedMentee(mentee);
  };

  const closeMenteeProfile = () => {
    setSelectedMentee(null);
  };

  // Function to handle deletion confirmation
  const handleDeleteConfirmation = (mentee) => {
    setMenteeToDelete(mentee);
  };

  const addMenteeOnBackend = async (mentee) => {
    try {
      await axios
        .post("http://127.0.0.1:8000/addMentee/", mentee)
        .then((response) => {
          // If the backend successfully updates the mentee, update your local state
          if (response.status === 200) {
            // Clear the form and close the modal
            setMenteeForm({
              name: "",
              id: "",
              department: "",
              email: "",
              mentorId: "",
            });
            setAddMenteeModalVisible(false);
            setMentees((prevMentees) => [...prevMentees, mentee]); // Add the new mentee to the mentees list
            console.log("Mentee added successfully on the backend");
          }
        });
    } catch (error) {
      console.error("Error updating meeting on the backend:", error);
      // Handle errors or display an error message to the user.
    }
  };

  // Function to delete a mentee
  const handleDeleteMentee = async () => {
    if (menteeToDelete) {
      // Perform mentee deletion logic (API call or other)
      // Update the mentors list after successful deletion

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/deleteMenteeById/",
          JSON.stringify({ id: menteeToDelete.id })
        );
        if (response.status === 200) {
          // setMentees((prevMentees) =>
          //   prevMentees.filter((mentee) => mentee.id !== menteeToDelete.id)
          // );
          setMenteeToDelete(null); // Clear the mentee to delete
          fetchMenteeList();
        }
      } catch (error) {
        console.error("Error deleting mentee:", error);
      }
    }
  };

  // Function to cancel the mentee deletion
  const handleCancelDelete = () => {
    setMenteeToDelete(null); // Clear the mentee to delete
  };

  const editMenteeProfile = () => {
    console.log(`Edit Clicked for ${selectedMentee.name}`);
  };

  // Function to handle the form submission when adding a mentee
  const handleAddMentee = () => {
    // Form validation
    if (
      !menteeForm.name || // Check if name is empty
      !menteeForm.id || // Check if roll number is empty
      !menteeForm.department || // Check if department is empty
      !menteeForm.email || // Check if email is empty
      !menteeForm.mentorId // Check if mentor id is empty
    ) {
      // You can display an error message or handle validation as needed
      console.error("Please fill in all required fields.");
      return;
    }
    // Add the mentee to the list
    addMenteeOnBackend(menteeForm);
  };

  const handleOpenUploadCSV = () => {
    // console.log("here")
    setmenteeUploadCSV(true);
  };

  const handleCloseUploadCSV = () => {
    setmenteeUploadCSV(false);
  };

  return (
    <div>
      <Navbar className="fixed-top" userDetails={userDetails} />
      <div className="container">
        <div className="text-center my-3">
          <h4>Mentees List</h4>
        </div>
        <div className="input-group my-3">
          <input
            type="text"
            className="form-control mx-2"
            placeholder="Search Mentees"
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
          onClick={() => setAddMenteeModalVisible(true)}
        >
          Add Mentee
        </button>
        <div
          className={`modal ${addMenteeModalVisible ? "show" : ""}`}
          tabIndex="-1"
          role="dialog"
          style={{
            display: addMenteeModalVisible ? "block" : "none",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Mentee</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setAddMenteeModalVisible(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {/* Mentee Form */}
                <form onSubmit={handleAddMentee}>
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={menteeForm.name}
                      onChange={(e) =>
                        setMenteeForm({ ...menteeForm, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Roll Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={menteeForm.id}
                      onChange={(e) =>
                        setMenteeForm({ ...menteeForm, id: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={menteeForm.email}
                      onChange={(e) =>
                        setMenteeForm({ ...menteeForm, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Department</label>
                    <select
                      className="form-select"
                      name="department"
                      value={menteeForm.department}
                      required // Make the select required
                      onChange={(e) =>
                        setMenteeForm({
                          ...menteeForm,
                          department: e.target.value,
                        })
                      }
                    >
                      <option value="" disabled>
                        Select Department
                      </option>
                      {Object.entries(departmentOptions).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  {/* <div className="form-group">
                    <label>Department *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={menteeForm.department}
                      onChange={(e) =>
                        setMenteeForm({
                          ...menteeForm,
                          department: e.target.value,
                        })
                      }
                      required
                    />
                  </div> */}
                  <div className="form-group">
                    <label>Mentor Roll Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={menteeForm.mentorId}
                      onChange={(e) =>
                        setMenteeForm({
                          ...menteeForm,
                          mentorId: e.target.value,
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

        <button className="btn btn-primary mx-2" onClick={handleOpenUploadCSV}>
          Upload CSV
        </button>

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
                {mentees
                  .filter((mentee) => {
                    const lowerSearchTerm = searchTerm.toLowerCase();
                    const lowerName = mentee.name.toLowerCase();
                    const lowerId = mentee.id.toLowerCase();
                    const departmentLabel =
                      departmentOptions[mentee.department] || "";
                    const lowerDepartment = departmentLabel.toLowerCase();
                    return (
                      lowerName.includes(lowerSearchTerm) ||
                      lowerId.includes(lowerSearchTerm) ||
                      lowerDepartment.includes(lowerSearchTerm)
                    );
                  })
                  .map((mentee) => (
                    <tr
                      className=""
                      key={mentee.id}
                      // onClick={() => openMenteeProfile(mentee)}
                      style={{ cursor: "pointer" }}
                    >
                      <td
                        style={{
                          width: headerColumnWidths["name"],
                        }}
                      >
                        <button
                          className="btn btn-link"
                          onClick={() => openMenteeProfile(mentee)}
                        >
                          {mentee.name}
                        </button>
                      </td>
                      <td
                        style={{
                          width: headerColumnWidths["id"],
                        }}
                      >
                        {mentee.id}
                      </td>
                      <td
                        style={{
                          width: headerColumnWidths["department"],
                        }}
                      >
                        {departmentOptions[mentee.department]}
                      </td>
                      <td
                        style={{
                          width: headerColumnWidths["actions"],
                        }}
                      >
                        <button
                          className="btn btn-sm"
                          onClick={() => handleDeleteConfirmation(mentee)}
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
            {/* Mentee Profile Popup */}
            {selectedMentee && (
              <div
                className="modal fade show"
                style={{ display: "block" }}
                tabIndex="-1"
                role="dialog"
                aria-labelledby="menteeProfilePopup"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <MenteeProfile
                    mentee={selectedMentee}
                    onClose={closeMenteeProfile}
                    onEdit={editMenteeProfile}
                    departmentOptions={departmentOptions}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className="modal"
          style={{ display: menteeToDelete ? "block" : "none" }}
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
                {menteeToDelete ? menteeToDelete.name : ""}?
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
                  onClick={handleDeleteMentee}
                  data-dismiss="modal"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {menteeUploadCSV && (
          <MenteeUpload
            isOpen={menteeUploadCSV}
            closeModal={handleCloseUploadCSV}
            fetchMenteeList={fetchMenteeList}
            // onUpload = {onIpload}
          />
        )}
      </div>
    </div>
  );
};

export default MenteesList;
