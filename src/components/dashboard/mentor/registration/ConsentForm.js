import { useState } from 'react';
import {React} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ConsentForm({ userDetails }) {
  const [selectedOption, setSelectedOption] = useState(""); // State to store the selected option
  const navigate = useNavigate();

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };
  const sendConsent = async (ans) => {
    axios
      .post(
        "http://127.0.0.1:8000/consentResponse/",
        JSON.stringify({ id: userDetails.id, ans: ans })
      )
      .then((response) => {
        // If the backend successfully deletes the meeting, update your local state
        if (response.status === 200) {
          if (ans === 1) {
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
    // Handle the form submission, e.g., send the user's choice to the server.
    // You can use the selectedOption state for this purpose.
    let ans;
    if (selectedOption === "Yes") {
      ans = 1;
    } else {
      ans = 0;
    }
    // sendConsent(ans);
    if (ans === 1) {
      navigate("/dashboard/mentor/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center h-100">
      <div className="card p-4">
        <h1 className="text-center mb-4">Consent Form</h1>
        <p className="text-center mb-4">
          Are sure you want to participate in this Student Mentorship Programe?
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="yesOption"
              value="Yes"
              checked={selectedOption === "Yes"}
              onChange={handleOptionChange}
            />
            <label className="form-check-label" htmlFor="yesOption">
              Yes
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="noOption"
              value="No"
              checked={selectedOption === "No"}
              onChange={handleOptionChange}
            />
            <label className="form-check-label" htmlFor="noOption">
              No
            </label>
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

