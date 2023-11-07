import React from "react";

const Confirmation = ({
  inputValues,
  prevStep,
  saveAndContinue,
  sizeOptions,
  yearOptions,
  departmentOptions,
}) => {
  const { name, id, email, department, year, size, imgSrc } = inputValues;

  const back = (e) => {
    e.preventDefault();
    prevStep();
  };

  return (
    <div className="container">
      <h1 className="my-4">Confirm your Details</h1>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Roll Number:</strong> {id}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Department:</strong> {departmentOptions[department]}
            </p>
            <p>
              <strong>Year:</strong> {yearOptions[year]}
            </p>
            <p>
              <strong>Size:</strong> {sizeOptions[size]}
            </p>
          </div>

          <button className="btn btn-secondary mx-3" onClick={back}>
            Back
          </button>
          <button className="btn btn-primary mx-3" onClick={saveAndContinue}>
            Confirm
          </button>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <p>
              <strong>Image:</strong>
            </p>
            <img
              src={imgSrc}
              alt="User Profile"
              className="img-fluid"
              style={{ width: "50%", height: "50%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
