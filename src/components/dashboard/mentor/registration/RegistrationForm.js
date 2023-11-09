import React, { useState } from "react";
import UserDetails from "./UserDetails";
import Confirmation from "./Confirmation";
import ConsentForm from "./ConsentForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import Navbar from "../../common/Navbar";
import Questions from "./Questions";
import axios from "axios";

export default function RegistrationForm() {
  const { userDetails } = useAuth();
  const [step, setStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  // const [score, setScore] = useState(0);

  const [selectedOptions, setSelectedOptions] = useState({});
    // const [score, setScore] = useState(0);

  const handleCheckboxChange = (questionIndex, optionIndex) => {
      setSelectedOptions(prevSelectedOptions => ({
      ...prevSelectedOptions,
      [questionIndex]: optionIndex
      }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newScore = 0;
    for (const questionIndex in selectedOptions) {
      const selectedOption = selectedOptions[questionIndex];
      const correctOption = questions[questionIndex].correctAnswer - 1;

      // console.log(selectedOption)
      // console.log(correctOption)

      if (selectedOption === correctOption) {
        newScore += 4; // Award 4 points for correct answer
      }
    }

    // console.log(newScore)
    // setScore(newScore);
    setFormData({
      ...formData,
      score: newScore,
    });
    nextStep();
  };

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    department: "",
    year: "",
    size: "",
    imgSrc: "",
    score: 0,
  });

  const questions = [
    {
      "question" : "Question 1",
      "options" : ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 1
    },
    {
      "question" : "Question 2",
      "options" : ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 1
    }
  ]

  const departmentOptions = {
    "B-CSB": "CSB (B.Tech.)",
    "B-CSSS": "CSSS (B.Tech.)",
    "B-CSD": "CSD (B.Tech.)",
    "B-CSE": "CSE (B.Tech.)",
    "B-CSAI": "CSAI (B.Tech.)",
    "B-CSAM": "CSAM (B.Tech.)",
    "B-ECE": "ECE (B.Tech.)",
    "B-EVE": "EVE (B.Tech.)",
    "M-CSE": "CSE (M.Tech.)",
    "M-ECE": "ECE (M.Tech.)",
    "M-CB": "CB (M.Tech.)",
  };

  const yearOptions = {
    B1: "B.Tech. 1st year",
    B2: "B.Tech. 2nd year",
    B3: "B.Tech. 3rd year",
    B4: "B.Tech. 4th year",
    M1: "M.Tech. 1st year",
    M2: "M.Tech. 2nd year",
  };

  const sizeOptions = {
    S: "Small",
    M: "Medium",
    L: "Large",
    XL: "Extra Large",
    XXL: "XXL",
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
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
          setFormData({
            ...formData,
            imgSrc: imageBase64,
          });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const navigate = useNavigate();

  const saveAndContinue = (e) => {
    e.preventDefault();

    // code for writing to the file or database

    // variable -> score

    // console.log(score)
    // console.log(selectedOptions)
    // Create a JSON object from the formData
    const formDataJSON = {
      id: formData.id,
      name: formData.name,
      email: formData.email,
      department: formData.department,
      year: formData.year,
      size: formData.size,
      imgSrc: formData.imgSrc,
      score: formData.score,
    };

    // Make a POST request to your backend
    axios
      .post("http://127.0.0.1:8000/addCandidate/", formDataJSON)
      .then((response) => {
        console.log("Data sent to the backend:", response.data);
        // Redirect to the next step or do any other necessary actions
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error sending data to the backend:", error);
        // Handle the error as needed
      });

  };

  return (
    <div>
      <Navbar className="fixed-top" />
      {userDetails.id === -1 && step === 1 && (
        // If userDetails.id is -1 and step is 1, show UserDetails
        <UserDetails
          nextStep={nextStep}
          handleChange={handleChange}
          handleImageChange={handleImageChange}
          inputValues={formData}
          sizeOptions={sizeOptions}
          yearOptions={yearOptions}
          departmentOptions={departmentOptions}
        />
      )}

      {userDetails.id === -1 && step === 2 && (
        <Questions
          nextStep={nextStep}
          handleCheckboxChange={handleCheckboxChange}
          handleSubmit={handleSubmit}
          questions={questions}
        />
      )}

      {userDetails.id === -1 && step === 3 && (
        <Confirmation
          nextStep={nextStep}
          prevStep={prevStep}
          inputValues={formData}
          sizeOptions={sizeOptions}
          yearOptions={yearOptions}
          departmentOptions={departmentOptions}
          saveAndContinue={saveAndContinue}
        />
      )}

      {userDetails.id !== -1 && userDetails.status === 1 && (
        // If userDetails.id is not -1 and userDetails.status is 1, show "Form submitted. Please wait for approval."
        <div className="container d-flex justify-content-center justify-text-center align-items-center h-100-center">
          <div className="card p-4 mt-5">
            Form submitted. Please wait for approval.
          </div>
        </div>
      )}

      {userDetails.id !== -1 && userDetails.status === 2 && (
        // If userDetails.id is not -1 and userDetails.status is 2, show ConsentForm component
        <ConsentForm userDetails={userDetails} />
      )}
      {userDetails.id !== -1 && userDetails.status === 4 && (
        // If userDetails.id is not -1 and userDetails.status is 2, show ConsentForm component
        <div className="container d-flex justify-content-center justify-text-center align-items-center h-100-center">
          <div className="card p-4 mt-5">
            We are sorry to inform you that you are not selected for Student
            Mentorship Programme.
          </div>
        </div>
      )}
    </div>
  );
}
