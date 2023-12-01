import React, { useState, useEffect } from "react";
import UserDetails from "./UserDetails";
import Confirmation from "./Confirmation";
import ConsentForm from "./ConsentForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import Navbar from "../../common/Navbar";
import Questions from "./Questions";
import registrationQuestions from "../../../../data/registrationQuestions.json";
import axios from "axios";

export default function RegistrationForm() {
  const { userDetails,logout } = useAuth();
  const [step, setStep] = useState(1);
  const [enrollmentFormStatus, setEnrollmentFormStatus] = useState([]);
  const [consentFormStatus, setConsentFormStatus] = useState([]);

  useEffect(() => {
    // setConsentFormStatus(userDetails.f2);
    // setEnrollmentFormStatus(userDetails.f1); 
    const fetchFormStatus = async () => {
      try {
        const response = await axios.post(
          "https://smpportal.iiitd.edu.in/api/getFormStatus/"
        );
        const filteredEnrollmentFormStatus = response.data.filter(
          (status) => status.formId === "1"
        );
        const filteredConsentFormStatus = response.data.filter(
          (status) => status.formId === "2"
        );
        setConsentFormStatus(filteredConsentFormStatus[0]["formStatus"]);
        setEnrollmentFormStatus(filteredEnrollmentFormStatus[0]["formStatus"]);
        console.log(filteredEnrollmentFormStatus[0]["formStatus"]);
        console.log(filteredConsentFormStatus[0]["formStatus"]);
      } catch (error) {
        console.error("Error fetching form status:", error);
      }
    };

    fetchFormStatus();
  }, []);

  const handleChangeQuestionInMain = (questionId,value) => {
    setFormData({
      ...formData,
      [questionId]: value,
    });
  };
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: userDetails.email,
    department: "",
    year: "",
    contact: "",
  });

  const initialDepartmentOptions = {
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
  const [departmentOptions, setDepartmentOptions] = useState(
    initialDepartmentOptions
  );

  const yearOptions = {
    // B1: "B.Tech. 1st year",
    // B2: "B.Tech. 2nd year",
    B3: "B.Tech. 3rd year",
    B4: "B.Tech. 4th year",
    // M1: "M.Tech. 1st year",
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "year") {
      const selectedYear = e.target.value;
      let updatedDepartments = { ...initialDepartmentOptions };

      // Filtering departments based on selectedYear
      if (selectedYear.startsWith("B3") || selectedYear.startsWith("B4")) {
        updatedDepartments = Object.fromEntries(
          Object.entries(updatedDepartments).filter(([key]) =>
            key.startsWith("B")
          )
        );
      } else if (selectedYear.startsWith("M2")) {
        updatedDepartments = Object.fromEntries(
          Object.entries(updatedDepartments).filter(([key]) =>
            key.startsWith("M")
          )
        );
      }

      setFormData({
        ...formData,
        [name]: value,
        department: "", // Clear the selected department when year changes
      });

      // Update departmentOptions state with filtered departments
      setDepartmentOptions(updatedDepartments);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const navigate = useNavigate();

  const saveAndContinue = (e) => {
    e.preventDefault();
    // Create a JSON object from the formData
    // const formDataJSON = {
    //   id: formData.id,
    //   name: formData.name,
    //   email: formData.email,
    //   department: formData.department,
    //   year: formData.year,
    //   contact: formData.contact,
    //   size: "",
    // };

    // Make a POST request to your backend
    axios
      .post("https://smpportal.iiitd.edu.in/api/addCandidate/", JSON.stringify(formData))
      .then((response) => {
        console.log("Data sent to the backend:", response.data);
        // Redirect to the next step or do any other necessary actions
        logout();
        alert("Enrollment Form Submitted Successfully. You are logged out.");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error sending data to the backend:", error);
        console.log(formData);
        // Handle the error as needed
      });
  };

  return (
    <div>
      <Navbar className="fixed-top" />
      {enrollmentFormStatus === "1" &&
        userDetails.id === -1 &&
        step === 1 && (
          // If userDetails.id is -1 and step is 1, show UserDetails
          <UserDetails
            nextStep={nextStep}
            handleChange={handleChange}
            inputValues={formData}
            yearOptions={yearOptions}
            departmentOptions={departmentOptions}
          />
        )}

      {enrollmentFormStatus === "1" &&
        userDetails.id === -1 &&
        step === 2 && (
          <Questions
            nextStep={nextStep}
            prevStep={prevStep}
            questions={registrationQuestions["questions"]}
            handleChangeQuestionInMain={handleChangeQuestionInMain}
          />
        )}

      {enrollmentFormStatus === "1" &&
        userDetails.id === -1 &&
        step === 3 && (
          <Confirmation
            nextStep={nextStep}
            prevStep={prevStep}
            inputValues={formData}
            questions={registrationQuestions["questions"]}
            yearOptions={yearOptions}
            departmentOptions={departmentOptions}
            saveAndContinue={saveAndContinue}
          />
        )}

      {userDetails.id === -1 && enrollmentFormStatus === "0" && (
        // If userDetails.id is not -1 and userDetails.status is 1, show "Form submitted. Please wait for approval."
        <div className="container d-flex justify-content-center justify-text-center align-items-center h-100-center">
          <div className="card p-4 mt-5">Admin is not accepting responses.</div>
        </div>
      )}

      {userDetails.id !== -1 && userDetails.status === 1 && (
        // If userDetails.id is not -1 and userDetails.status is 1, show "Form submitted. Please wait for approval."
        <div className="container d-flex justify-content-center justify-text-center align-items-center h-100-center">
          <div className="card p-4 mt-5">
            Enrollment Form submitted. Please wait for approval.
          </div>
        </div>
      )}

      {consentFormStatus === "1" &&
        userDetails.id !== -1 &&
        userDetails.status === 2 && (
          // If userDetails.id is not -1 and userDetails.status is 2, show ConsentForm component
          <ConsentForm userDetails={userDetails} sizeOptions={sizeOptions} />
        )}
      {consentFormStatus === "0" &&
        userDetails.id !== -1 &&
        userDetails.status === 2 && (
          // If userDetails.id is not -1 and userDetails.status is 2, show ConsentForm component
          <div className="container d-flex justify-content-center justify-text-center align-items-center h-100-center">
            <div className="card p-4 mt-5">
              Consent Form Closed. Please contact admin.
            </div>
          </div>
        )}
      {userDetails.id !== -1 && userDetails.status === 3 && (
        // If userDetails.id is not -1 and userDetails.status is 2, show ConsentForm component
        <div className="container d-flex justify-content-center justify-text-center align-items-center h-100-center">
          <div className="card p-4 mt-5">
            We have got your consent. You can use portal after mentee
            allocation. We appreciate your patience till then.
          </div>
        </div>
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
