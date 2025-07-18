import Navbar from "../../../navbar/Navbar";
import { useAuth } from "../../../../context/AuthContext";
import React, { useState, useEffect } from "react";
import deleteIcon from "../../../../images/delete_icon.png";
import MenteeProfile from "./MenteeProfile";
import MenteeUpload from "./MenteeUpload";
import axios from "axios";
import ChangeMentor from "./ChangeMentor";
import departmentOptions from "../../../../data/departmentOptions.json";
import { DownloadCSV } from "../DownloadCSV";
import { Form } from 'react-bootstrap';

const MenteesList = () => {
  // Dummy data (replace with actual data fetching)
  const { userDetails } = useAuth();
  const [mentees, setMentees] = useState([]);
  const [isFirstTime, setisFirstTime] = useState(true);
  const [totalEntries, setTotalEntries] = useState(0);
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState("");

  // Function to fetch Mentee list from Django endpoint
  const fetchMenteeList = async () => {
    try {
      // Make an https GET request to your Django endpoint
      const response = await axios.get("https://smpportal.iiitd.edu.in/api/getAllMentees/"); // Replace with your Django API endpoint

      // Update the state with the fetched Mentee list
      setMentees(response.data);
      setTotalEntries(response.data.length);
    } catch (error) {
      console.error("Error fetching Mentee list:", error);
    }
  };
  // Call the function to fetch the Mentee list when the component loads
  useEffect(() => {
    if (isFirstTime) {
      setisFirstTime(false);
      fetchMenteeList();
    }
  }, [isFirstTime]);
  const [searchTerm, setSearchTerm] = useState("");
  const [menteeToDelete, setMenteeToDelete] = useState(null);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [menteeUploadCSV, setmenteeUploadCSV] = useState(false);

  // State for controlling the "Add Mentee" pop-up
  const [addMenteeModalVisible, setAddMenteeModalVisible] = useState(false);
  // State for mentee form fields
  const [menteeForm, setMenteeForm] = useState({
    name: "",
    id: "",
    department: "",
    email: "",
    mentorName: "",
    mentorEmail: "",
    mentorId: "",
    contact: "",
  });

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

  const [showChangeMentor, setshowChangeMentor] = useState(false);
  const [editMentee, seteditMentee] = useState(null);
  const [currMentee, setcurrMentee] = useState(null);

  const handleChangeMentor = (mentee) => {
    seteditMentee({
      mentorID: "",
      mentorName: "",
      menteeId: mentee.id,
    });
    setcurrMentee(mentee);
    setshowChangeMentor(true);
  };

  const editMentor = async () => {
    axios
      .post(
        "https://smpportal.iiitd.edu.in/api/editMenteeById/",
        JSON.stringify({
          id: editMentee.menteeId,
          mentorId: editMentee.mentorId,
          department: currMentee.department,
        })
      )
      .then((response) => {
        if (response.status === 200) {
          alert(response.data.message);
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("Error changing Mentor", error);
      });
  };

  const handleSaveChangeMentor = () => {
    editMentor();
    setshowChangeMentor(false);
  };

  const handleCloseChangeMentor = () => {
    setshowChangeMentor(false);
  };

  const addMenteeOnBackend = async (mentee) => {
    try {
      await axios
        .post("https://smpportal.iiitd.edu.in/api/addMentee/", mentee)
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
              contact: "",
            });
            setAddMenteeModalVisible(false);
            alert(response.data.message);
            window.location.reload();
          } else {
            alert("Mentee could not be added, please try again.")
          }
        });
    } catch (error) {
      console.error("Error updating", error);
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
          "https://smpportal.iiitd.edu.in/api/deleteMenteeById/",
          JSON.stringify({ id: menteeToDelete.id })
        );
        if (response.status === 200) {
          // setMentees((prevMentees) =>
          //   prevMentees.filter((mentee) => mentee.id !== menteeToDelete.id)
          // );
          setMenteeToDelete(null); // Clear the mentee to delete
          window.location.reload();
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
      !menteeForm.mentorId || // Check if mentor id is empty
      !menteeForm.contact
    ) {
      // You can display an error message or handle validation as needed
      console.error("Please fill in all required fields.");
      return;
    }

    // Check if the name is valid (no numbers or special characters)
    const nameRegex = /^[a-zA-Z\s]+$/; // Allow only letters
    if (!nameRegex.test(menteeForm.name)) {
      alert("Please enter a valid name without numbers or special characters.");
      return;
    }

    // Modify the name to the desired format
    const formattedName = menteeForm.name
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word

    menteeForm.name = formattedName;

    if (isNaN(Number(menteeForm.contact)) || menteeForm.contact.length !== 10) {
      alert("Please enter a valid 10-digit contact number.");
      return;
    }

    // Add the mentee to the list
    addMenteeOnBackend(menteeForm);
  };

  const handleOpenUploadCSV = () => {
    setmenteeUploadCSV(true);
  };

  const handleCloseUploadCSV = () => {
    setmenteeUploadCSV(false);
  };



  const filteredMentees = mentees.filter((mentee) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const lowerName = mentee.name.toLowerCase();
    const lowerId = mentee.id.toLowerCase();
    const departmentLabel = departmentOptions[mentee.department] || "";
    const lowerDepartment = departmentLabel.toLowerCase();

    // Apply department filter
    const isDepartmentFiltered =
      !selectedDepartmentFilter ||
      mentee.department === selectedDepartmentFilter;

    return (
      isDepartmentFiltered &&
      (lowerName.includes(lowerSearchTerm) ||
        lowerId.includes(lowerSearchTerm) ||
        lowerDepartment.includes(lowerSearchTerm))
    );
  });
  useEffect(() => {
    // Update filtered total entries when filteredMentors change
    setTotalEntries(filteredMentees.length);
  }, [filteredMentees]);

  return (
    <div>
      <Navbar className="fixed-top" userDetails={userDetails} />
      <div className="container mb-5">
        <div className="text-center my-3">
          <h4>B.Tech Mentees List</h4>
          <p>Total Entries: {totalEntries}</p>
        </div>
        <div className="input-group my-3">
          {/* Search Mentees input */}
          <input
            type="text"
            className="form-control"
            placeholder="Search Mentees"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="input-group-append mx-2">
            <Form.Select
              value={selectedDepartmentFilter}
              onChange={(e) => setSelectedDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {Object.keys(departmentOptions).map((department) => (
                <option key={department} value={department}>
                  {departmentOptions[department]}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>
        <button
          className="btn btn-primary mx-2"
          onClick={() => setAddMenteeModalVisible(true)}
          data-toggle="tooltip"
          data-placement="bottom"
          title="Add new mentee"
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
                  <div className="form-group">
                    <label>Contact *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={menteeForm.contact}
                      onChange={(e) =>
                        setMenteeForm({
                          ...menteeForm,
                          contact: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Department</label>
                    <Form.Select
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
                    </Form.Select>
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

        <button
          className="btn btn-primary mx-2"
          onClick={handleOpenUploadCSV}
          data-toggle="tooltip"
          data-placement="bottom"
          title="Upload a new CSV file to replace the current list."
        >
          Upload New CSV
        </button>
        <DownloadCSV type={"mentorMenteeMapping"}></DownloadCSV>
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
                </tr>
              </thead>
              <tbody>
                {/* Display the list of mentees */}
                {filteredMentees.map((mentee) => (
                  <tr
                    className="table-row"
                    key={mentee.id}
                    // onClick={() => openMenteeProfile(mentee)}
                    style={{ cursor: "pointer" }}
                  >
                    <td
                      style={{ backgroundColor: mentee.mentorId === "NULL" ? "yellow" : "" }}
                    >
                      <button
                        className="btn btn-link"
                        onClick={() => openMenteeProfile(mentee)}
                      >
                        {mentee.name}
                      </button>
                    </td>
                    <td
                      style={{ backgroundColor: mentee.mentorId === "NULL" ? "yellow" : "" }}
                    >{mentee.id}</td>
                    <td
                      style={{ backgroundColor: mentee.mentorId === "NULL" ? "yellow" : "" }}
                    >
                      {departmentOptions[mentee.department]}
                    </td>
                    <td
                      style={{ backgroundColor: mentee.mentorId === "NULL" ? "yellow" : "" }}
                    >
                      <div className="d-flex">
                        <button
                          className="btn btn-sm mr-2"
                          onClick={() => handleDeleteConfirmation(mentee)}
                        >
                          <img
                            src={deleteIcon}
                            alt="Delete"
                            style={{ width: "20px", height: "20px" }}
                          />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-dark ml-4"
                          onClick={() => handleChangeMentor(mentee)}
                        >
                          Change Mentor
                        </button>
                      </div>
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
          // onUpload = {onIpload}
          />
        )}

        {showChangeMentor && (
          <ChangeMentor
            handleSave={handleSaveChangeMentor}
            handleClose={handleCloseChangeMentor}
            editMentee={editMentee}
            seteditMentee={seteditMentee}
            currMentee={currMentee}
          />
        )}
      </div>
    </div>
  );
};

export default MenteesList;
