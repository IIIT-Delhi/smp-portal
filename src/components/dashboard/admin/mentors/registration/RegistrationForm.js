import React, { useState } from "react";
import UserDetails from "./UserDetails";
import Confirmation from "./Confirmation";

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
    1: "1",
    2: "2",
    3: "3",
    4: "4",
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
        />
      );
    default:
      return null;
  }
}
