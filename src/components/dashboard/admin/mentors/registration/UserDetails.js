import React from "react";

function UserDetails(props) {
  const {
    inputValues,
    handleChange,
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

  const saveAndContinue = (e) => {
    e.preventDefault();

    // Check if any input value is empty
    if (
      inputValues.name === "" ||
      inputValues.id === "" ||
      inputValues.email === "" ||
      inputValues.department === "" ||
      inputValues.year === "" ||
      inputValues.size === ""
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
          <label className="label" htmlFor="formName">
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
          <label className="label" htmlFor="formId">
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
          <label className="label" htmlFor="formEmail">
            Email Address
          </label>
          <input
            type="email"
            className="form-control"
            defaultValue={inputValues.email}
            name="email"
            required // Make the input required
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Department</label>
          <select
            className="form-control"
            name="department"
            value={inputValues.department}
            required // Make the select required
            onChange={handleChange}
          >
            {Object.entries(departmentOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
            <option value="" disabled />
          </select>
        </div>

        <div className="mb-3">
          <label>Year</label>
          <select
            className="form-control"
            name="year"
            value={inputValues.year}
            required // Make the select required
            onChange={handleChange}
          >
            {Object.entries(yearOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
            <option value="" disabled />
          </select>
        </div>

        <div className="mb-3">
          <label>Size</label>
          <select
            className="form-control"
            name="size"
            value={inputValues.size}
            required // Make the select required
            onChange={handleChange}
          >
            {Object.entries(sizeOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
            <option value="" disabled />
          </select>
        </div>

        <button className="btn btn-primary" onClick={saveAndContinue}>
          Next
        </button>
      </form>
    </div>
  );
}

export default UserDetails;
