import React from 'react'
import { useState } from 'react';

export default function Questions({
  questions,
  prevStep,
  handleSubmit,
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

  return (
    <div className="container">
      <form>
        {questions.map((question) => (
          <div key={question.id} className="mb-3">
            <label className="form-label">{question.question}</label>
            {question.options.map((option, index) => (
              <div key={index} className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id={`${question.id}-option-${index}`}
                  value={option}
                  checked={questionAns[question.id] === index}
                  onChange={(e) => handleChangeQuestion(question.id, index)}
                  name={`question${question.id}`}
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

      <button className="btn btn-secondary mb-5 mx-2" onClick={prevStep}>
        Back
      </button>

      <button className="btn btn-primary mb-5" onClick={handleSubmit}>
        Next
      </button>
    </div>
  );
}
