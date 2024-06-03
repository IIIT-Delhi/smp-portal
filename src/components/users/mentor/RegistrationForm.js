import React, { useState, useEffect } from "react";
import UserDetails from "./UserDetails";
import Confirmation from "./Confirmation";
import ConsentForm from "./ConsentForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Navbar from "../../navbar/Navbar";
import Questions from "./Questions";
import registrationQuestions from "../../../data/registrationQuestions.json";
import initialDepartmentOptions from "../../../data/departmentOptions.json";
import yearOptions from "../../../data/yearOptions.json";
import sizeOptions from "../../../data/sizeOptions.json";
import axios from "axios";

export default function RegistrationForm() {
  const { userDetails, logout } = useAuth();
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
      } catch (error) {
        console.error("Error fetching form status:", error);
      }
    };

    fetchFormStatus();
  }, []);

  const handleChangeQuestionInMain = (questionId, value) => {
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

  const [departmentOptions, setDepartmentOptions] = useState(
    initialDepartmentOptions
  );

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
    axios
      .post("https://smpportal.iiitd.edu.in/api/addCandidate/", JSON.stringify(formData))
      .then((response) => {
        // Redirect to the next step or do any other necessary actions
        logout();
        alert("Enrollment form submitted successfully. Please wait for further instructions, admin will contact you if you are selected. Please visit again to check the status. You are logged out.");
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
      {enrollmentFormStatus === "1" && userDetails.id === -1 && step === 1 && (
        // If userDetails.id is -1 and step is 1, show UserDetails
        <UserDetails
          nextStep={nextStep}
          handleChange={handleChange}
          inputValues={formData}
          yearOptions={yearOptions}
          departmentOptions={departmentOptions}
        />
      )}

      {enrollmentFormStatus === "1" && userDetails.id === -1 && step === 2 && (
        <Questions
          nextStep={nextStep}
          prevStep={prevStep}
          questions={registrationQuestions["questions"]}
          handleChangeQuestionInMain={handleChangeQuestionInMain}
        />
      )}

      {enrollmentFormStatus === "1" && userDetails.id === -1 && step === 3 && (
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
            Congratulations for successfully completing the Mentorship enrollment process. We have got your consent. You can use portal after mentee
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

      {(userDetails.id !== -1 && userDetails.status === -1) && (
        // If userDetails.id is not -1 and userDetails.status is -1
        <div className="container d-flex justify-content-center justify-text-center align-items-center h-100-center">
          <div className="card p-4 mt-5">
            You have been removed from the program. Please contact admin.
          </div>
           
        </div>
      )}
    </div>
  );
}
