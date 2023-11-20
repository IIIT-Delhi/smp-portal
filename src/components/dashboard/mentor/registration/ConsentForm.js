import { useState } from 'react';
import {React} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import consentQuestions from '../../../../data/consentQuestions.json';

export default function ConsentForm({ userDetails , sizeOptions}) {
  // const [selectedOption, setSelectedOption] = useState(""); // State to store the selected option
  const navigate = useNavigate();
  const [consentData, setConsentData] = useState({
    id: userDetails.id,
    imgSrc: "",
    size:"",
  });
  const handleChange = (e) => {
    setConsentData({
      ...consentData,
      [e.target.name]: e.target.value.trim(),
    });
  }

  const handleChangeQuestion = (questionId, value) => {
    setConsentData({
      ...consentData,
      [questionId]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      if (file.size > 200000) {
        alert("Image size exceeds 200KB. Please select a smaller image.");
        e.target.value = null; // Clear the selected file
      } else {
        // Handle the selected image, e.g., store it in component state
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageBase64 = event.target.result; // Base64-encoded image
          setConsentData({
            ...consentData,
            imgSrc: imageBase64,
          });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const sendConsent = async () => {
    axios
      .post(
        "http://127.0.0.1:8000/consentResponse/",
        JSON.stringify(consentData)
      )
      .then((response) => {
        // If the backend successfully deletes the meeting, update your local state
        if (response.status === 200) {
          if (consentData.response === "Yes") {
            navigate("/dashboard/mentor/profile");
          } else {
            navigate("/login");
          }
        }
      })
      .catch((error) => {
        console.error("Error sending consent:", error);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    sendConsent();
  };

  return (
    <div className="container">
      <h1 className="text-center mb-4">Consent Form</h1>
      <form onSubmit={handleSubmit}>
        {consentQuestions["questions"].map((question) => (
          <div key={question.id} className="mb-3">
            <label className="form-label">{question.question}</label>
            {question.options.map((option, index) => (
              <div key={index} className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id={`${question.id}-option-${index}`}
                  value={option}
                  checked={consentData[question.id] === option}
                  onChange={(e) =>
                    handleChangeQuestion(
                      question.id,
                      e.target.value
                    )
                  }
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

        <div className="mb-3">
          <label className="form-label">T-Shirt Size</label>
          <select
            className="form-select"
            name="size"
            value={consentData.size}
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
        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
      </form>
    </div>
  );
}

