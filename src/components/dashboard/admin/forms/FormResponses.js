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
  const [totalEntries, setTotalEntries] = useState(0);
  const [sortOption, setSortOption] = useState("default");
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("");

  const handleExpandQuestion = (index) => {
    setExpandedQuestion((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleExpandResponse = (index) => {
    setExpandedResponse((prevIndex) => (prevIndex === index ? null : index));
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}..` : text;
  };

  const getAnswerForQuestion = (questionId, response, formType) => {
    if (formType === "1") {
      if (questionId === "score") {
        return response.responses[questionId];
      }
      const question = registrationQuestions.questions.find(
        (q) => q.id === questionId
      );
      return question ? question.options[response.responses[questionId]] : "";
    } else if (formType === "2") {
      if (questionId === "score") {
        return statusOptions[response.responses[questionId]];
      }
      const question = consentQuestions.questions.find(
        (q) => q.id === questionId
      );
      return question ? question.options[response.responses[questionId]] : "";
    }
    // Handle other form types if needed
    return response.responses[questionId];
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
  const statusOptions = {
    0: "Accepted",
    1: "Rejected",
  };

  useEffect(() => {
    // Update filtered total entries when filteredMentors change
    setTotalEntries(filteredResponses.length);
  }, [filteredResponses]);

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
      // Apply department filter
      const isDepartmentFiltered =
        !selectedDepartmentFilter ||
        response["department"] === selectedDepartmentFilter;

      // Apply Status filter (only when formType is "2")
      const isStatusFiltered =
        formType === "2" &&
        (!selectedStatusFilter ||
          response.responses["score"].toString() === selectedStatusFilter);

      return (
        isDepartmentFiltered &&
        isStatusFiltered &&
        (response.submitterId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          response.submitterName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          includesTerm)
      );
    });
    setFilteredResponses(filtered);
  }, [formResponses, searchTerm, formType, selectedDepartmentFilter, selectedStatusFilter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMentorMenteeMapping = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/createMentorMenteePair/"
      );
      if (response.data.message === "Mentor-Mentee Mapping is completed!") {
        alert("Mentor-Mentee Mapping is completed!");
        navigate("/dashboard/admin/mentors");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error calling Mentor-Mentee Mapping API:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendConsentEmail = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/sendConsentEmail/"
      );
      if (response.data.message === "Mail send successfully") {
        alert("Mail sent successfully!!");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error calling Mentor-Mentee Mapping API:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (option) => {
    setSortOption(option);

    // Perform sorting logic based on the selected option
    let sortedResponses = [...filteredResponses];

    switch (option) {
      case "submitter-id-min-to-max":
        sortedResponses.sort((a, b) => a.submitterId - b.submitterId);
        break;
      case "submitter-id-max-to-min":
        sortedResponses.sort((a, b) => b.submitterId - a.submitterId);
        break;
      case "score-max-to-min":
        sortedResponses.sort((a, b) => b.responses.score - a.responses.score);
        break;
      case "score-min-to-max":
        sortedResponses.sort((a, b) => a.responses.score - b.responses.score);
        break;
      case "meetings-max-to-min":
        sortedResponses.sort((a, b) => b.responses.fq1 - a.responses.fq1);
        break;
      case "meetings-min-to-max":
        sortedResponses.sort((a, b) => a.responses.fq1 - b.responses.fq1);
        break;
      case "treats-max-to-min":
        sortedResponses.sort((a, b) => b.responses.fq1 - a.responses.fq1);
        break;
      case "treats-min-to-max":
        sortedResponses.sort((a, b) => a.responses.fq2 - b.responses.fq2);
        break;
      case "submitter-name-a-to-z":
        sortedResponses.sort((a, b) =>
          a.submitterName.localeCompare(b.submitterName)
        );
        break;
      case "submitter-name-z-to-a":
        sortedResponses.sort((a, b) =>
          b.submitterName.localeCompare(a.submitterName)
        );
        break;
      case "mentor-name-a-to-z":
        sortedResponses.sort((a, b) =>
          a.response.mentorName.localeCompare(b.response.mentorName)
        );
        break;
      case "mentor-name-z-to-a":
        sortedResponses.sort((a, b) =>
          b.response.mentorName.localeCompare(a.response.mentorName)
        );
        break;
      case "mentor-id-min-to-max":
        sortedResponses.sort(
          (a, b) => a.response.mentorId - b.response.mentorId
        );
        break;
      case "mentor-id-max-to-min":
        sortedResponses.sort(
          (a, b) => b.response.mentorId - a.response.mentorId
        );
        break;
      default:
        break;
    }

    setFilteredResponses(sortedResponses);
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
        {formType === "1" && (
          <div className="text-center mb-4">
            <button
              className="btn btn-outline-dark"
              data-mdb-ripple-color="dark"
              onClick={handleSendConsentEmail}
              disabled={loading}
            >
              {loading ? "Sending mail..." : "Send Consent Form"}
            </button>
          </div>
        )}
        {/* <h1 className="text-center mb-4">Form Responses</h1> */}
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
            <select
              className="form-control"
              value={selectedDepartmentFilter}
              onChange={(e) => setSelectedDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {Object.keys(departmentOptions).map((department) => (
                <option key={department} value={department}>
                  {departmentOptions[department]}
                </option>
              ))}
            </select>
          </div>
          {formType === "2" && (
            <div className="input-group-append">
              <select
                className="form-control"
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                {Object.keys(statusOptions).map((status) => (
                  <option key={status} value={status}>
                    {statusOptions[status]}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(formType === "1" || formType === "3") && (
            <div className="input-group-append mx-2">
              <select
                className="form-control"
                value={sortOption}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="default" disabled={true}>
                  Sort By
                </option>
                {/* <option value="submitter-id-min-to-max">
                Submitter Id (Min to Max)
              </option>
              <option value="submitter-id-max-to-min">
                Submitter Id (Max to Min)
              </option> */}
                {formType === "1" && (
                  <option value="score-max-to-min">Score (Max to Min)</option>
                )}
                {formType === "1" && (
                  <option value="score-min-to-max">Score (Min to Max)</option>
                )}
                {formType === "3" && (
                  <option value="meetings-min-to-max">
                    Meetings (Min to Max)
                  </option>
                )}
                {formType === "3" && (
                  <option value="meetings-max-to-min">
                    Meetings (Max to Min)
                  </option>
                )}
                {formType === "3" && (
                  <option value="treats-min-to-max">Treats (Min to Max)</option>
                )}
                {formType === "3" && (
                  <option value="treats-max-to-min">Treats (Max to Min)</option>
                )}
              </select>
            </div>
          )}
        </div>
        <p>Total Entries: {totalEntries}</p>
        {filteredResponses.length === 0 ? (
          <p>No responses found for this form.</p>
        ) : (
          <div
            className="table-container text-left"
            style={{ overflow: "auto", maxHeight: "400px" }}
          >
            <div className="table-body">
              <table className="table table-bordered">
                <thead
                  style={{
                    position: "sticky",
                    top: "0",
                    backgroundColor: "white",
                    zIndex: "1",
                  }}
                >
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
                    {formType === "1" && <th>Score</th>}
                    {formType === "2" && <th>Status</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredResponses.map((response, index) => (
                    <tr key={index}>
                      <td>{response.submitterId}</td>
                      <td>{response.submitterName}</td>
                      {Object.keys(response.responses).map((key, idx) => (
                        <td key={idx}>
                          <span
                            className="truncated"
                            title={getAnswerForQuestion(
                              key,
                              response,
                              formType
                            )}
                            onClick={() => handleExpandResponse(idx)}
                            style={{ cursor: "pointer" }}
                          >
                            {expandedResponse === idx
                              ? getAnswerForQuestion(key, response, formType)
                              : truncateText(
                                  getAnswerForQuestion(key, response, formType),
                                  15
                                )}
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
