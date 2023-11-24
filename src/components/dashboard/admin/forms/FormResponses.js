import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../common/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import registrationQuestions from "../../../../data/registrationQuestions.json";
import consentQuestions from "../../../../data/consentQuestions.json";
import menteeFeedbackQuestions from "../../../../data/menteeFeedbackQuestions.json";
import formNames from "../../../../data/formNames.json";

const FormResponses = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formType } = location.state || { formType: 1 };
  const [formResponses, setFormResponses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResponses, setFilteredResponses] = useState([]);
  const [questionSet, setQuestionSet] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [expandedResponse, setExpandedResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExpandQuestion = (index) => {
    setExpandedQuestion((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleExpandResponse = (index) => {
    setExpandedResponse((prevIndex) => (prevIndex === index ? null : index));
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}..` : text;
  };

  const getQuestionSet = (formType) => {
    switch (formType) {
      case "1":
        return registrationQuestions;
      case "2":
        return consentQuestions;
      case "3":
        return menteeFeedbackQuestions;
      default:
        return [];
    }
  };

  useEffect(() => {
    const fetchFormResponses = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/getFormResponse/",
          {
            formType: formType,
          }
        );
        setFormResponses(response.data.formResponses);
      } catch (error) {
        console.error("Error fetching form responses:", error);
      }
    };

    fetchFormResponses();
  }, [formType]);

  useEffect(() => {
    setQuestionSet(getQuestionSet(formType)["questions"]);
    const filtered = formResponses.filter((response) => {
      const values = Object.values(response.responses);
      const includesTerm = values.some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
      return (
        response.submitterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.submitterName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        includesTerm
      );
    });
    setFilteredResponses(filtered);
  }, [formResponses, searchTerm, formType]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMentorMenteeMapping = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/createMentorMenteePair/"
      );
      // Handle the response data if needed

      // Show an alert
      if(response.data.message === "Mentor-Mentee Mapping is completed!"){
        alert("Mentor-Mentee Mapping is completed!");

        // Navigate to '/dashboard/admin/mentors'
          navigate("/dashboard/admin/mentors");
      }
      else{
        alert(response.data.message);
      }        
    } catch (error) {
      console.error("Error calling Mentor-Mentee Mapping API:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <div>
      <Navbar className="fixed-top" />
      <div className="container mt-3">
        {formType === "2" && (
          <div className="text-center mb-4">
            <button
              className="btn btn-outline-dark"
              data-mdb-ripple-color="dark"
              onClick={handleMentorMenteeMapping}
              disabled={loading}
            >
              {loading ? "Mapping in Progress..." : "Mentor-Mentee Mapping"}
            </button>
          </div>
        )}
        <h1 className="text-center mb-4">Form Responses</h1>
        <h4 className="text-center mb-4">{formNames[formType]}</h4>

        <div className="input-group my-3">
          <input
            type="text"
            className="form-control mx-2"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="input-group-append mx-2">
            <button className="btn btn-outline-secondary" type="button">
              Search
            </button>
          </div>
        </div>
        {filteredResponses.length === 0 ? (
          <p>No responses found for this form.</p>
        ) : (
          <div className="table-container text-left">
            {/* <div className="table-header">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Submitter ID</th>
                    <th>Submitter Name</th>
                    {questionSet.map((question, index) => (
                      <th key={index}>
                        <span
                          className="truncated"
                          title={question.question}
                          onClick={() => handleExpandQuestion(index)}
                          style={{ cursor: "pointer" }}
                        >
                          {expandedQuestion === index
                            ? question.question
                            : truncateText(question.question, 5)}
                        </span>
                      </th>
                    ))}
                    {formType === "3" && <th>Mentor Id</th>}
                    {formType === "3" && <th>Mentor Name</th>}
                  </tr>
                </thead>
              </table>
            </div> */}
            <div className="table-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Submitter ID</th>
                    <th>Submitter Name</th>
                    {questionSet.map((question, index) => (
                      <th key={index}>
                        <span
                          className="truncated"
                          title={question.question}
                          onClick={() => handleExpandQuestion(index)}
                          style={{ cursor: "pointer" }}
                        >
                          {expandedQuestion === index
                            ? question.question
                            : truncateText(question.question, 15)}
                        </span>
                      </th>
                    ))}
                    {formType === "3" && <th>Mentor Id</th>}
                    {formType === "3" && <th>Mentor Name</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredResponses.map((response, index) => (
                    <tr key={index}>
                      <td>{response.submitterId}</td>
                      <td>{response.submitterName}</td>
                      {Object.keys(response.responses).map((key, idx) => (
                        <td>
                          <span
                            className="truncated"
                            title={response.responses[key]}
                            onClick={() => handleExpandResponse(idx)}
                            style={{ cursor: "pointer" }}
                          >
                            {expandedResponse === idx
                              ? response.responses[key]
                              : truncateText(response.responses[key], 15)}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormResponses;
