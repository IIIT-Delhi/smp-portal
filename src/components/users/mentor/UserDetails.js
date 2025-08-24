import React from "react";
import {Form} from "react-bootstrap";

function UserDetails(props) {
  const {
    inputValues,
    handleChange,
    nextStep,
    yearOptions,
    departmentOptions,
  } = props;

  const saveAndcontinue = (e) => {
    e.preventDefault();

    // Check if any input value is empty
    if (
      inputValues.name === "" ||
      inputValues.id === "" ||
      inputValues.email === "" ||
      inputValues.department === "" ||
      inputValues.year === "" ||
      inputValues.contact === ""
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Check if the name is valid (no numbers or special characters)
    const nameRegex = /^[a-zA-Z\s]+$/; // Allow only letters
    if (!nameRegex.test(inputValues.name)) {
      alert("Please enter a valid name without numbers or special characters.");
      return;
    }

    // Modify the name to the desired format
    const formattedName = inputValues.name
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word

    inputValues.name = formattedName;

    if (
      isNaN(Number(inputValues.contact)) ||
      inputValues.contact.length !== 10
    ) {
      alert("Please enter a valid 10-digit contact number.");
      return;
    }

    // Proceed to the next step
    nextStep();
  };

  return (
    <div className="container">
      <form>
        <h1 className="text-center mb-4">B.Tech Student Mentor Enrollment</h1>
        <p className="text-left">
          Dear Students,
          <br />
          You're requested to fill out this form carefully. There are 6 Multiple choice questions in this, and you're suggested to read them properly and answer based on your own thought process.
        </p>

        <div className="mb-3">
          <label className="form-label" htmlFor="formName">
            Full Name (as per records)
          </label>
          <input
            type="text"
            className="form-control"
            defaultValue={inputValues.name}
            name="name"
            required // Make the input required
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="formId">
            Roll Number
          </label>
          <input
            type="text"
            className="form-control"
            defaultValue={inputValues.id}
            name="id"
            required // Make the input required
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="formEmail">
            Email Address
          </label>
          <input
            type="email"
            className="form-control"
            defaultValue={inputValues.email}
            name="email"
            disabled
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Year</label>
          <Form.Select
            name="year"
            value={inputValues.year}
            required // Make the select required
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Year
            </option>
            {Object.entries(yearOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="mb-3">
          <label className="form-label">Department</label>
          <Form.Select
            name="department"
            value={inputValues.department}
            required // Make the select required
            onChange={handleChange}
            disabled={!inputValues.year} // Disable if year not selected
          >
            <option value="" disabled>
              Select Department
            </option>
            {Object.entries(departmentOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="formContact">
            Contact Number
          </label>
          <div className="input-group">
            <span className="input-group-text">+91</span>
            <input
              type="text"
              className="form-control"
              defaultValue={inputValues.contact}
              name="contact"
              required // Make the input required
              onChange={handleChange}
            />
          </div>
        </div>
        <button className="btn btn-primary mb-5" onClick={saveAndcontinue}>
          Next
        </button>
      </form>
    </div>
  );
}

export default UserDetails;
