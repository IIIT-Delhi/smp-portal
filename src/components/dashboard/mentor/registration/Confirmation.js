import React from "react";

const Confirmation = ({
  inputValues,
  prevStep,
  saveAndContinue,
  sizeOptions,
  yearOptions,
  departmentOptions,

}) => {
  const { name, id, email, department, year, size,imgSrc } = inputValues;

  const back = (e) => {
    e.preventDefault();
    prevStep();
  };

  // const saveAndContinue = (e) => {
  //   e.preventDefault();
  //   nextStep();
  // };

  return (
    <div className="container">
      <h1>Confirm your Details</h1>
      <p>Confirm if the following details are correct.</p>
      <p>Name: {name}</p>
      <p>Roll Number: {id}</p>
      <p>Email: {email}</p>
      <p>Department: {departmentOptions[department]}</p>
      <p>Year: {yearOptions[year]}</p>
      <p>Size: {sizeOptions[size]}</p>
      <div>
        <p>Image:</p>
        <img
          src={imgSrc}
          alt="User Profile"
          style={{ maxWidth: "150px", maxHeight: "auto" }}
        />
      </div>
      <div className="my-2">
        <button className="btn btn-secondary" onClick={back}>
          Back
        </button>{" "}
        <button className="btn btn-primary" onClick={saveAndContinue}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
