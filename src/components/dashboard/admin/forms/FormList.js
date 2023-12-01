import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../common/Navbar";
import { useNavigate } from "react-router-dom";
import formNames from "../../../../data/formNames.json";

const FormList = () => {
  const [formStatus, setFormStatus] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFormStatus = async () => {
      try {
        const response = await axios.post(
          "https://smpportal.iiitd.edu.in/api/getFormStatus/"
        );
        setFormStatus(response.data);
      } catch (error) {
        console.error("Error fetching form status:", error);
      }
    };

    fetchFormStatus();
  }, []);

  const handleStatusChange = async (formId, status) => {
    try {
      await axios.post("https://smpportal.iiitd.edu.in/api/updateFormStatus/", {
        formId,
        formStatus: status,
      });
      const response = await axios.post("https://smpportal.iiitd.edu.in/api/getFormStatus/");
      setFormStatus(response.data);
    } catch (error) {
      console.error("Error updating form status:", error);
    }
  };

  const handleFormClick =  (formType) => {
    // try {
    //   const response = await axios.post(
    //     "https://smpportal.iiitd.edu.in/api/getFormResponse/",
    //     {
    //       formType,
    //     }
    //   );
    //   console.log("Form Responses:", response.data);
    //   // Redirect to FormResponses.js passing the responses as props
    //   // Example: <Link to={{ pathname: "/form-responses", state: { responses: response.data } }}>Go to Form Responses</Link>
    // } catch (error) {
    //   console.error("Error fetching form responses:", error);
    // }
    navigate("/dashboard/admin/form-responses/", {
      state: { formType: formType },
    });
  };

  return (
    <div>
      <Navbar className="fixed-top" />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Form List</h1>
        <ul className="list-group">
          {formStatus
            .sort((a, b) => parseInt(a.formId) - parseInt(b.formId))
            .map((form) => (
              <li
                key={form.formId}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>{formNames[form.formId]}</div>
                <div>Status: {form.formStatus === "1" ? "On" : "Off"}</div>
                <div className="p-2">
                  <label className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={form.formStatus === "1"}
                      onChange={() =>
                        handleStatusChange(
                          form.formId,
                          form.formStatus === "1" ? "0" : "1"
                        )
                      }
                      style={{ cursor: "pointer", borderColor: "gray" }}
                    />
                    <span className="slider round"></span>
                  </label>
                  <button
                    className="btn btn-primary mx-2 my-2"
                    onClick={() => handleFormClick(form.formId)}
                  >
                    View Responses
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default FormList;
