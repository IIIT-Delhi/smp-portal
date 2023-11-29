import React from 'react'
import { useState } from 'react';

export default function Questions({
  questions,
  nextStep,
  prevStep,
  handleChangeQuestionInMain,
}) {
  const [questionAns, setQuestionAns] = useState({});
  const handleChangeQuestion = (questionId, value) => {
    setQuestionAns({
      ...questionAns,
      [questionId]: value,
    });
    handleChangeQuestionInMain(questionId, value);
  };
  const back = (e) => {
    e.preventDefault();
    prevStep();
  };
  const next = (e) => {
    e.preventDefault();
    // Check if any input value is empty
    if (
      Object.keys(questionAns).length !== questions.length ||
      Object.values(questionAns).includes(undefined)
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    nextStep();
  };
  return (
    <div className="container">
      <div className="card p-4 mt-2">
        <h1 className="text-center mb-4">Enrollment Form</h1>
        <p className="text-left">
        Dear Students,
            <br />
            You're requested to fill out this form carefully. There are 6 Multiple choice questions in this and you're suggested to read them properly and answer based on your own thought process.
            </p>
        <form>
          {questions.map((question) => (
            <div key={question.id} className="mx-2 mb-3">
              <label className="form-label">
                <strong>{question.question}</strong>
              </label>
              {question.options.map((option, index) => (
                <div key={index} className="mx-2 form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id={`${question.id}-option-${index}`}
                    value={option}
                    checked={questionAns[question.id] === index}
                    onChange={(e) => handleChangeQuestion(question.id, index)}
                    name={question.id}
                    style={{ borderColor: "gray" }} // Add this line
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`${question.id}-option-${index}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </form>
      </div>
      <div className="container my-4">
        <button className="btn btn-secondary mb-5 mx-2" onClick={back}>
          Back
        </button>

        <button className="btn btn-primary mb-5" onClick={next}>
          Next
        </button>
      </div>
    </div>
  );
}
