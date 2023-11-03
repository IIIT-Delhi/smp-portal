import React from "react";

const Confirmation = ({
  inputValues,
  prevStep,
  nextStep,
  sizeOptions,
  yearOptions,
  departmentOptions,
}) => {
  const { name, id, email, department, year, size } = inputValues;

  const back = (e) => {
    e.preventDefault();
    prevStep();
  };

  const saveAndContinue = (e) => {
    e.preventDefault();
    nextStep();
  };

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
      <button className="btn btn-secondary" onClick={back}>
        Back
      </button>{" "}
      <button className="btn btn-primary" onClick={saveAndContinue}>
        Confirm
      </button>
    </div>
  );
};

export default Confirmation;
