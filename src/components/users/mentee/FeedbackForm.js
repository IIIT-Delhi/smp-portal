import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import Navbar from "../../navbar/Navbar";
import axios from "axios";
import { Form } from "react-bootstrap";

export default function MenteeForm() {
  const { userDetails } = useAuth();
  const [formStatus, setFormStatus] = useState([]);
  const [feedbackQuestions, setFeedbackQuestions] = useState([]);
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);
  const [checkingSubmission, setCheckingSubmission] = useState(true);

  const [formData, setFormData] = useState({
    id: userDetails.id,
    mentorId: userDetails.mentorId,
    mentorName: userDetails.mentorName,
  });

  const quesOptions = ["Pathetic", "Bad", "No Comments", "Good", "Excellent"];

  useEffect(() => {
    const fetchFormStatus = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/getFormStatus/"
        );
        const filteredFormStatus = response.data.filter(
          (status) => status.formId === "3"
        );
        setFormStatus(filteredFormStatus[0]["formStatus"]);
      } catch (error) {
        console.error("Error fetching form status:", error);
      }
    };

    const fetchFeedbackQuestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/json/getFormQuestions/feedback/"
        );
        setFeedbackQuestions(response.data);
        
        // Initialize form data with empty values for each question
        const initialFormData = {
          id: userDetails.id,
          mentorId: userDetails.mentorId,
          mentorName: userDetails.mentorName,
        };
        
        response.data.forEach(question => {
          initialFormData[question.id] = "";
        });
        
        setFormData(initialFormData);
      } catch (error) {
        console.error("Error fetching feedback questions:", error);
      }
    };

    const checkFeedbackSubmission = async () => {
      try {
        setCheckingSubmission(true);
        const response = await axios.post(
          "http://localhost:8000/api/checkFeedbackSubmission/",
          { id: userDetails.id }
        );
        setHasSubmittedFeedback(response.data.hasSubmitted);
      } catch (error) {
        console.error("Error checking feedback submission:", error);
      } finally {
        setCheckingSubmission(false);
      }
    };

    fetchFormStatus();
    fetchFeedbackQuestions();
    checkFeedbackSubmission();
  }, [userDetails.id, userDetails.mentorId, userDetails.mentorName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/menteeFilledFeedback/", formData)
      .then((response) => {
        console.log("Data sent to the backend:", response.data);
        alert("Feedback Form Submitted Successfully.");
        // Clear the form after successful submission
        const clearedFormData = {
          id: userDetails.id,
          mentorId: userDetails.mentorId,
          mentorName: userDetails.mentorName,
        };
        
        feedbackQuestions.forEach(question => {
          clearedFormData[question.id] = "";
        });
        
        setFormData(clearedFormData);
      })
      .catch((error) => {
        console.error("Error sending data to the backend:", error);
        if (error.response && error.response.status === 400) {
          // Check if it's the "already submitted" error
          if (error.response.data && error.response.data.message === "Feedback form already submitted") {
            alert("You have already submitted your feedback form. Thank you!");
          } else {
            alert("Error submitting form. Please try again.");
          }
        } else {
          alert("Error submitting form. Please try again.");
        }
      });
  };

  return (
    <div>
      {userDetails.mentorId === "NULL" && (
        <div>
          <Navbar className="fixed-top" />
          <div className="container d-flex justify-content-center justify-text-center align-items-center h-100-center">
            <div className="card p-4 mt-5">Mentor not assigned.</div>
          </div>
        </div>
      )}
      {checkingSubmission && (
        <div>
          <Navbar className="fixed-top" />
          <div className="container d-flex justify-content-center justify-text-center align-items-center h-100-center">
            <div className="card p-4 mt-5">Loading...</div>
          </div>
        </div>
      )}
      {!checkingSubmission && hasSubmittedFeedback && userDetails.mentorId !== "NULL" && (
        <div>
          <Navbar className="fixed-top" />
          <div className="container d-flex justify-content-center justify-text-center align-items-center h-100-center">
            <div className="card p-4 mt-5">
              <h3 className="text-center text-success">
                <strong>Feedback Already Submitted</strong>
              </h3>
              <p className="text-center">
                Thank you! You have already submitted your feedback form for your mentor <strong>{userDetails.mentorName}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
      {!checkingSubmission && !hasSubmittedFeedback && userDetails.mentorId !== "NULL" && formStatus === "1" && (
        <div>
          <Navbar className="fixed-top" />
          <div className="container">
            <div className="card p-4 my-4">
              <h1 className="text-center">
                <strong>Mentor Feedback Form</strong>
              </h1>
              <p className="text-left">
                Dear Students,
                <br />
                This is a feedback form that you are supposed to fill against the services of your Student Mentor to you.
                <br />
                Your honest feedback is really important for our Student Mentorship Program. Please do not ignore this.
              </p>
              <div className="card p-2 my-2">
                <div className="row text-center">
                  <div className="col">
                    <strong>Mentee Name:</strong> {userDetails.name}
                  </div>
                  <div className="col">
                    <strong>Mentor Name:</strong> {userDetails.mentorName}
                  </div>
                </div>
              </div>
              <form onSubmit={submit}>
                {feedbackQuestions.map((question, index) => (
                  <div key={question.id} className="form-group mb-2">
                    <label className="mb-1">
                      {question.question}
                    </label>
                    {question.id === "fq1" || question.id === "fq2" ? (
                      <input
                        type="number"
                        className="form-control"
                        name={question.id}
                        value={formData[question.id] || ""}
                        onChange={handleChange}
                        required
                      />
                    ) : question.id === "fq3" ? (
                      <textarea
                        className="form-control"
                        name={question.id}
                        value={formData[question.id] || ""}
                        onChange={handleChange}
                        required
                      />
                    ) : question.id === "fq4" ? (
                      <Form.Select
                        name={question.id}
                        value={formData[question.id] || ""}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>
                          Select Option
                        </option>
                        {quesOptions.map((option, optionIndex) => (
                          <option key={optionIndex} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Select>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name={question.id}
                        value={formData[question.id] || ""}
                        onChange={handleChange}
                        required
                      />
                    )}
                  </div>
                ))}
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {!checkingSubmission && !hasSubmittedFeedback && userDetails.mentorId !== "NULL" && formStatus === "0" && (
        // If userDetails.id is not -1 and userDetails.status is 1, show "Form submitted. Please wait for approval."
        <div>
          <Navbar className="fixed-top" />
          <div className="container d-flex justify-content-center justify-text-center align-items-center h-100-center">
            <div className="card p-4 mt-5">
              Form is closed. Please contact admin for further details.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
