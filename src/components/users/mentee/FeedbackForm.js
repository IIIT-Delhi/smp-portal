import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import Navbar from "../../navbar/Navbar";
import axios from "axios";
import {Form} from "react-bootstrap";

export default function MenteeForm() {
  const { userDetails } = useAuth();
  const [formStatus, setFormStatus] = useState([]);

  const [formData, setFormData] = useState({
    id: userDetails.id,
    mentorId: userDetails.mentorId,
    mentorName: userDetails.mentorName,
    fq1: "",
    fq2: "",
    fq3: "",
    fq4: "",
  });

  const quesOptions = ["Pathetic", "Bad", "No Comments", "Good", "Excellent"];

  useEffect(() => {
    const fetchFormStatus = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/getFormStatus/"
        );
        const filteredFormStatus = response.data.filter(
          (status) => status.formId === "3"
        );
        setFormStatus(filteredFormStatus[0]["formStatus"]);
      } catch (error) {
        console.error("Error fetching form status:", error);
      }
    };

    fetchFormStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/menteeFilledFeedback/", formData)
      .then((response) => {
        console.log("Data sent to the backend:", response.data);
        alert("Feedback Form Submitted Successfully.");
        // Clear the form after successful submission
        setFormData({
          ...formData,
          fq1: "",
          fq2: "",
          fq3: "",
          fq4: "",
        });
      })
      .catch((error) => {
        console.error("Error sending data to the backend:", error);
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
      {userDetails.mentorId !== "NULL" && formStatus === "1" && (
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
                <div className="form-group mb-2">
                  <label className="mb-1">
                    1. How many meetings your mentor had with you till date?
                    (only number allowed)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="fq1"
                    value={formData.fq1}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group mb-2">
                  <label className="mb-1">
                    2. How many times your mentor has given you treat till date?
                    (only number allowed)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="fq2"
                    value={formData.fq2}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group mb-2">
                  <label className="mb-1">
                    3. How has the mentor helped you? or any remarks.
                  </label>
                  <textarea
                    className="form-control"
                    name="fq3"
                    value={formData.fq3}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">4. Rate your mentor</label>
                  <Form.Select
                    name="fq4"
                    value={formData.fq4}
                    onChange={handleChange}
                    required // Make the select required
                  >
                    <option value="" disabled>
                      Select Option
                    </option>
                    {quesOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {userDetails.mentorId !== "NULL" && formStatus === "0" && (
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
