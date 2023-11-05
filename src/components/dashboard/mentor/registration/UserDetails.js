import React from "react";

function UserDetails(props) {
  const {
    inputValues,
    handleChange,
    handleImageChange,
    prevStep,
    nextStep,
    sizeOptions,
    yearOptions,
    departmentOptions,
  } = props;

  const back = (e) => {
    e.preventDefault();
    prevStep();
  };

  const saveAndcontinue = (e) => {
    e.preventDefault();

    // Check if any input value is empty
    if (
      inputValues.name === "" ||
      inputValues.id === "" ||
      inputValues.email === "" ||
      inputValues.department === "" ||
      inputValues.year === "" ||
      inputValues.size === "" ||
      inputValues.imgSrc === ""
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Proceed to the next step
    nextStep();
  };
  


  return (
    <div className="container">
      <form>
        <div className="mb-3">
          <label className="form-label" htmlFor="formName">
            Full Name
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
            required // Make the input required
            disabled // Disable the input
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Department</label>
          <select
            className="form-select"
            name="department"
            value={inputValues.department}
            required // Make the select required
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Department
            </option>
            {Object.entries(departmentOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Year</label>
          <select
            className="form-select"
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
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Size</label>
          <select
            className="form-select"
            name="size"
            value={inputValues.size}
            required // Make the select required
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Size
            </option>
            {Object.entries(sizeOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Passport-size Photo</label>
          <input
            type="file"
            className="form-control"
            name="imgSrc"
            accept="image/*" // Allow only image files
            required // Make the input required
            onChange={handleImageChange} // Handle image selection
          />
        </div>

        <button className="btn btn-primary mb-5" onClick={saveAndcontinue}>
          Next
        </button>
      </form>
    </div>
  );
}

export default UserDetails;
