import React from "react";

const Confirmation = ({
  inputValues,
  prevStep,
  saveAndContinue,
  yearOptions,
  departmentOptions,
  questions,
}) => {
  const { name, id, email, department, year, contact } = inputValues;

  const back = (e) => {
    e.preventDefault();
    prevStep();
  };

  return (
    <div className="container">
      <h1 className="my-4 text-center">Confirm your Details</h1>

      <div className="row">
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
            <strong>Contact:</strong> {contact}
          </p>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="mb-3">
          <h2>Answers:</h2>
          {questions.map((question) => (
            <div key={question.id}>
              <p>
                <strong>{question.question}</strong>
              </p>
              <p>
                <strong>Answer:</strong>{" "}
                {question.options[inputValues[question.id]]}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="container mb-5">
        <button className="btn btn-secondary mx-3" onClick={back}>
          Back
        </button>
        <button className="btn btn-primary mx-3" onClick={saveAndContinue}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
