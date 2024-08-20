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
          Thank you for showing interest in joining the Student Mentorship Program at IIITD. Your participation is crucial in helping new students navigate both academic and personal experiences smoothly.
          <br />
          <b>Instructions:</b>
          <br />
          <b>Commitment:</b> Please apply to the SMP only if you are committed and willing to invest your time and effort in mentorship activities.
          <br />
          <b>Identification Details:</b> Carefully fill in your identification details.
          <br />
          <b>Questionnaire:</b> The form includes a short questionnaire with six multiple-choice questions. Please read them carefully and answer based on your own perspective. There are no right or wrong answers.
          <br />
          Thank you for your cooperation.
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
