import React, { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import Navbar from "../../common/Navbar";
import axios from "axios";

export default function MenteeForm() {
  const { userDetails } = useAuth();

  const [formData, setFormData] = useState({
    id: userDetails.id,
    mentorId: userDetails.mentorId,
    fq1: "",
    fq2: "",
    fq3: "",
    fq4: "",
  });

  const quesOptions = [
    "Pathetic",
    "Bad",
    "No Comments",
    "Good",
    "Excellent",
  ];

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

  if (userDetails.f3 === 0) {
    return (
      <div>
        <Navbar className="fixed-top" />
        <div className="container d-flex justify-content-center justify-text-center align-items-center h-100-center">
          <div className="card p-4 mt-5">
            Feedback Form not open. Admin is not accepting responses.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar className="fixed-top" />
      <div className="container">
        <div className="card p-4 my-4">
          <h1 className="text-center">
            <strong>Feedback Form</strong>
          </h1>
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
                1. How many meetings your mentor had with you till date? (only
                number allowed)
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
              <select
                className="form-select"
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
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
