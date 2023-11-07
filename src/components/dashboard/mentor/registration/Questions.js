import React from 'react'
import { useState } from 'react';

export default function Questions({questions,prevStep,handleCheckboxChange,handleSubmit}) {

    
    return (
    <div className="container">
        <form>
        {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="mb-3">
            <label className="form-label">{question.question}</label>
            {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="form-check">
                <input
                    type="radio"
                    className="form-check-input"
                    name={`question-${questionIndex}`} 
                    id={`option-${questionIndex}-${optionIndex}`}
                    onChange={() => handleCheckboxChange(questionIndex, optionIndex)}
                />
                <label
                    className="form-check-label"
                    htmlFor={`option-${questionIndex}-${optionIndex}`}
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
