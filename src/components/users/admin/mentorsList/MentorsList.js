import Navbar from "../../../navbar/Navbar";
// import { useAuth } from "../../../../context/AuthContext";
import React, { useState, useEffect } from "react";
import deleteIcon from "../../../../images/delete_icon.png";
import axios from "axios"; // Import Axios
import MentorProfile from "./MentorProfile";
import departmentOptions from "../../../../data/departmentOptions.json";
import yearOptions from "../../../../data/yearOptions.json";
import sizeOptions from "../../../../data/sizeOptions.json";
import { DownloadCSV } from "../DownloadCSV";
import { Form } from "react-bootstrap";

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
  const [addMentorModalVisible, setAddMentorModalVisible] = useState(false);
  // State for mentor form fields
  const [mentorForm, setMentorForm] = useState({
    name: "",
    id: "",
    department: "",
    email: "",
    year: "",
    size: "",
    imgSrc: "",
    contact: "",
    score: 100,
  });

  const [filteredDepartmentOptions, setFilteredDepartmentOptions] = useState([]);

  useEffect(() => {
    if (mentorForm.year) {
      const yearPrefix = mentorForm.year.charAt(0).toUpperCase();
      const filteredDepts = Object.entries(departmentOptions).filter(([key]) => key.startsWith(yearPrefix));
      setFilteredDepartmentOptions(filteredDepts);
    } else {
      setFilteredDepartmentOptions([]);
    }
  }, [mentorForm.year]);

  // Function to fetch Mentor list from Django endpoint
  const fetchMentorList = async () => {
    try {
      // Make an https GET request to your Django endpoint
      const response = await axios.get("http://localhost:8000/api/getAllMentors/"); // Replace with your Django API endpoint

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

  const addMentorOnBackend = async (mentor) => {
    try {
      await axios
        .post("http://localhost:8000/api/addMentor/", mentor)
        .then((response) => {
          // If the backend successfully updates the mentor, update your local state
          if (response.status === 200) {
            // Clear the form and close the modal
            setMentorForm({
              name: "",
              id: "",
              department: "",
              email: "",
              year: "",
              size: "",
              imgSrc: "",
              contact: "",
              score: 100,
            });
            setAddMentorModalVisible(false);
            alert("Mentor added successfully");
            window.location.reload();
          }
        });
    } catch (error) {
      console.error("Error updating", error);
      // Handle errors or display an error message to the user.
    }
  };

  // Function to handle the form submission when adding a mentor
  const handleAddMentor = () => {
    console.log(mentorForm);
    // Form validation
    if (
      !mentorForm.name || // Check if name is empty
      !mentorForm.id || // Check if roll number is empty
      !mentorForm.department || // Check if department is empty
      !mentorForm.email || // Check if email is empty
      !mentorForm.year ||
      !mentorForm.size ||
      !mentorForm.imgSrc ||
      !mentorForm.contact
    ) {
      // You can display an error message or handle validation as needed
      console.error("Please fill in all required fields.");
      return;
    }

    // Check if the name is valid (no numbers or special characters)
    const nameRegex = /^[a-zA-Z\s]+$/; // Allow only letters
    if (!nameRegex.test(mentorForm.name)) {
      alert("Please enter a valid name without numbers or special characters.");
      return;
    }

    // Modify the name to the desired format
    const formattedName = mentorForm.name
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word

    mentorForm.name = formattedName;

    if (isNaN(Number(mentorForm.contact)) || mentorForm.contact.length !== 10) {
      alert("Please enter a valid 10-digit contact number.");
      return;
    }

    // Add the mentor to the list
    addMentorOnBackend(mentorForm);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        e.target.value = null; // Clear the selected file
        return;
      }
      if (file.size > 250000) {
        alert("Image size exceeds 250KB. Please select a smaller image.");
        e.target.value = null; // Clear the selected file
      } else {
        // Create an image object to get the dimensions
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = function () {
          // Check image dimensions
          if (this.width > 600 || this.height > 600) {
            alert("Image dimensions must be less than 600x600 pixels.");
            e.target.value = null; // Clear the selected file
          } else {
            const reader = new FileReader();
            reader.onload = (event) => {
              const imageBase64 = event.target.result; // Base64-encoded image
              setMentorForm({
                ...mentorForm,
                imgSrc: imageBase64,
              });
            };
            reader.readAsDataURL(file);
          }
        };
      }
    }
  };

  // Function to delete a mentor
  const handleDeleteMentor = () => {
    if (mentorToDelete) {
      // Perform mentor deletion logic (API call or other)
      // Update the mentors list after successful deletion
      axios
        .post(
          "http://localhost:8000/api/deleteMentorById/",
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
            window.location.reload();
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
          <h4>Btech Mentors List</h4>
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

          {/* Total Mentees filter dropdown */}
          <div className="input-group-append">
            <Form.Select
              value={selectedTotalMenteesFilter}
              onChange={(e) => setSelectedTotalMenteesFilter(e.target.value)}
            >
              <option value="">All Total Mentees</option>
              {uniqueTotalMentees.map((totalMentees) => (
                <option key={totalMentees} value={totalMentees}>
                  {totalMentees}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>

        <button
          className="btn btn-primary mx-2"
          onClick={() => setAddMentorModalVisible(true)}
          data-toggle="tooltip"
          data-placement="bottom"
          title="Add new mentor"
        >
          Add Mentor
        </button>
        <div
          className={`modal ${addMentorModalVisible ? "show" : ""}`}
          tabIndex="-1"
          role="dialog"
          style={{
            display: addMentorModalVisible ? "block" : "none",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
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
                    <label>Full Name (as per records) *</label>
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
                    <label>Email Address *</label>
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
                    <label>Contact *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={mentorForm.contact}
                      onChange={(e) =>
                        setMentorForm({
                          ...mentorForm,
                          contact: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Year</label>
                    <Form.Select
                      name="year"
                      value={mentorForm.year}
                      required
                      onChange={(e) => {
                        const selectedYear = e.target.value;
                        setMentorForm({ ...mentorForm, year: selectedYear, department: "" });
                      }}
                    >
                      <option value="" disabled>Select Year</option>
                      {Object.entries(yearOptions).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </Form.Select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Department</label>
                    <Form.Select
                      name="department"
                      value={mentorForm.department}
                      required
                      onChange={(e) => setMentorForm({ ...mentorForm, department: e.target.value })}
                      disabled={!mentorForm.year}
                    >
                      <option value="" disabled>Select Department</option>
                      {filteredDepartmentOptions.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </Form.Select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">T-Shirt Size</label>
                    <Form.Select
                      name="size"
                      value={mentorForm.size}
                      required // Make the select required
                      onChange={(e) =>
                        setMentorForm({
                          ...mentorForm,
                          size: e.target.value,
                        })
                      }
                    >
                      <option value="" disabled>
                        Select Size
                      </option>
                      {Object.entries(sizeOptions).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      {
                        "Passport-size Photo (Max size - 250KB and dimesnions - 600x600 pixels allowed)"
                      }
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      name="imgSrc"
                      accept="image/*" // Allow only image files
                      required // Make the input required
                      onChange={handleImageChange} // Handle image selection
                    />
                    <p className="small text-muted">
                      If your image exceeds the size limit or dimensions, you
                      can resize it{" "}
                      <a
                        href="httpss://simpleimageresizer.com/resize-image-to-250-kb"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        here
                      </a>
                      .
                    </p>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Add
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <DownloadCSV type={"mentorMenteeMapping"}></DownloadCSV>
        <DownloadCSV type={"mentorImagesDownload"} list={mentors}></DownloadCSV>
        <DownloadCSV type={"tshirtSizes"} list={mentors}></DownloadCSV>

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
