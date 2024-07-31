import { useState } from 'react';
import { React } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import consentQuestions from '../../../data/consentQuestions.json';
import { useAuth } from '../../../context/AuthContext';
import { Form } from "react-bootstrap";

export default function ConsentForm({ userDetails, sizeOptions }) {
  // const [selectedOption, setSelectedOption] = useState(""); // State to store the selected option
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [consentData, setConsentData] = useState({
    id: userDetails.id,
    imgSrc: "",
    size: "",
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

      if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        e.target.value = null; // Clear the selected file
        return;
      }

      // Check file size
      if (file.size > 250000) {
        alert("Image size exceeds 250KB. Please select a smaller image.");
        e.target.value = null; // Clear the selected file
      } else {
        // Create an image object to get the dimensions
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = function () {
          // Check image dimensions
          if (this.width !== 600 || this.height !== 600) {
            alert("Image dimensions must be 600x600 pixels.");
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
        };
      }
    }
  };


  const sendConsent = async () => {
    axios
      .post(
        "http://smpportal.iiitd.edu.in/api/submitConsentForm/",
        JSON.stringify(consentData)
      )
      .then((response) => {
        // If the backend successfully deletes the meeting, update your local state
        if (response.status === 200) {
          logout();
          alert("Consent Form Submitted Successfully. You are logged out.");
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error("Error sending consent:", error);
        console.log(consentData);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    sendConsent();
  };

  return (
    <div className="container">
      <div className="card p-4 mt-2">
        <h1 className="text-center mb-4">Mentor Confirmation Form - SMP</h1>
        <p className="text-left">
          Dear Student,
          <br />
          Congratulations to you on getting shortlisted to be a Student Mentors
          for SMP.
          <br />
          Please review the confirmation form attentively, which outlines the
          commitments expected from you as a mentor and respond back
          accordingly.
          <br />
          You're requested to fill out this Confirmation form carefully
        </p>
        <hr />
        <form onSubmit={handleSubmit}>
          {consentQuestions["questions"].map((question, i) => (
            <div key={question.id} className="mx-2 mb-3">
              <label className="form-label">{`${i + 1}. ${question.question
                }`}</label>
              {question.options.map((option, index) => (
                <div key={index} className="mx-2 form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id={`${question.id}-option-${index}`}
                    value={option}
                    checked={consentData[question.id] === index}
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

          <div className="mb-3">
            <label className="form-label">T-Shirt Size</label>
            <Form.Select
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
            </Form.Select>
          </div>
          <div className="mb-3">
            <label className="form-label">
              {
                "Passport-size Photo (Max size - 250KB and dimesnions - 600x600 pixels allowed)"
              }
            </label>
            <input
              type="file"
              className="form-control"
              name="imgSrc"
              accept="image/*" // Allow only image files
              required // Make the input required
              onChange={handleImageChange} // Handle image selection
            />
            <p className="small text-muted">
              If your image exceeds the size limit or dimensions, you can resize
              it{" "}
              <a
                href="https://simpleimageresizer.com/resize-image-to-250-kb"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              .
            </p>
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

