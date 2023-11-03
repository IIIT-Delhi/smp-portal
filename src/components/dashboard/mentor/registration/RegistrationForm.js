import React, { useState } from "react";
import UserDetails from "./UserDetails";
import Confirmation from "./Confirmation";
import { useNavigate } from "react-router-dom";

export default function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    department: "",
    year: "",
    size: "",
  });
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
    "B1": "B.Tech. 1st year",
    "B2": "B.Tech. 2nd year",
    "B3": "B.Tech. 3rd year",
    "B4": "B.Tech. 4th year",
    "M1": "M.Tech. 1st year",
    "M2": "M.Tech. 2nd year",
  };

  const sizeOptions = {
    "S": "Small",
    "M": "Medium",
    "L": "Large",
    "XL": "Extra Large",
    "XXL": "XXL",
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

  const navigate = useNavigate();
  
  const saveAndContinue = (e) =>{
    e.preventDefault();

    // code for writing to the file or database

    navigate('/login');
  }

  switch (step) {
    case 1:
      return (
        <UserDetails
          nextStep={nextStep}
          handleChange={handleChange}
          inputValues={formData}
          sizeOptions={sizeOptions}
          yearOptions={yearOptions}
          departmentOptions={departmentOptions}
        />
      );
    // case 2:
    //   return (
    //     <QnAFormDetails
    //       nextStep={nextStep}
    //       prevStep={prevStep}
    //       handleChange={handleChange}
    //       inputValues={formData}
    //     />
    //   );
    case 2:
      return (
        <Confirmation
          nextStep={nextStep}
          prevStep={prevStep}
          inputValues={formData}
          sizeOptions={sizeOptions}
          yearOptions={yearOptions}
          departmentOptions={departmentOptions}
          saveAndContinue = {saveAndContinue}
        />
      );
    default:
      return null;
  }
}
