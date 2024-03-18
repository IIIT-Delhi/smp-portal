import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../common/Navbar";
import { useLocation } from "react-router-dom";
import registrationQuestions from "../../../../data/registrationQuestions.json";
import consentQuestions from "../../../../data/consentQuestions.json";
import menteeFeedbackQuestions from "../../../../data/menteeFeedbackQuestions.json";
import formNames from "../../../../data/formNames.json";
import departmentOptions from "../../../../data/departmentOptions.json";
import SendMail from "./SendMail";

const FormResponses = () => {
  const location = useLocation();
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
  const [newlySelectedStudents, setNewlySelectedStudents] = useState([]);
  const [showConsentModal, setshowConsentModal] = useState(false);

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
  
  const statusOptions = {
    0: "Accepted",
    1: "Rejected",
  };

  useEffect(() => {
    // Update filtered total entries when filteredMentors change
    setTotalEntries(filteredResponses.length);
  }, [filteredResponses]);

  useEffect(() => {
    console.log(formType);
    const fetchFormResponses = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/getFormResponse/",
          {
            formType: formType,
          }
        );
        setFormResponses(response.data.formResponses);
        console.log(response)

      } catch (error) {
        console.error("Error fetching form responses:", error);
      }
    };

    fetchFormResponses();
  }, [formType]);

  useEffect(() => {
    setQuestionSet(getQuestionSet(formType)["questions"]);
    // console.log(formResponses);
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
        (isStatusFiltered || formType !== "2") &&
        (response.submitterId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          response.submitterName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          includesTerm)
      );
    });

    console.log(filtered)
    setFilteredResponses(filtered);
  }, [
    formResponses,
    searchTerm,
    formType,
    selectedDepartmentFilter,
    selectedStatusFilter,
  ]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMentorMenteeMapping = async () => {
    setshowConsentModal(true)
  };

  const handleClose = () => {
    setshowConsentModal(false)
  }

  const handleSave = () => {
    setshowConsentModal(false)
  }

  const handleSendConsentEmail = async () => {

    setshowConsentModal(true)
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

  const handleCheckboxChange = (studentId, formType) => {
    setFilteredResponses((prevResponse) => {
      return prevResponse.map((response) => {
        if (response.submitterId === studentId) {
          if(formType === '1'){
          return { ...response, consent_status: response.consent_status === 0 ? 1 : 0 };
          }
          else{
            return { ...response, mapping_status: response.mapping_status === 0 ? 1 : 0 };
          }
        }
        return response;
      });
    });

    setNewlySelectedStudents((prevList) => {
      if (!prevList.includes(studentId)) {
        return [...prevList, studentId];
      } else {
        return prevList.filter((id) => id !== studentId);
      }
    });
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
              Mentor-Mentee Mapping
            </button>
          </div>
        )}
        {formType === "1" && (
          <div className="text-center mb-4">
            <button
              className="btn btn-outline-dark"
              data-mdb-ripple-color="dark"
              onClick={handleSendConsentEmail}
            >
              Send Consent Form
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
                    { formType !== '3' && (
                    <th>Select Student</th>
                    )}
                    <th>Roll Number</th>
                    { formType !== '3' && (
                    <th>Applicant Name</th>
                    )}
                    { formType == '3' && (
                    <th>Mentee Name</th>
                    )}
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Year</th>
                    <th>Department</th>
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
                            : truncateText(question.question, 3)}
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
                      {formType !== '3' && (
                      <td className='text-center'>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={response.submitterId}
                          checked={formType === '1' ? (response.consent_status === 1) : (response.mapping_status === 1)}
                          disabled = {((response.consent_status === 1 && formType === '1') || (response.mapping_status === 1 && formType === '2')) && !newlySelectedStudents.includes(response.submitterId)}
                          onChange={() => {return formType === '1' ? handleCheckboxChange(response.submitterId,formType) : handleCheckboxChange(response.submitterId,formType)}}
                        />
                      </td>
                      )}
                      <td>{response.submitterId}</td>
                      <td>{response.submitterName}</td>
                      <td>{response.submitterEmail}</td>
                      <td>{response.Contact}</td>
                      <td>{response.Year[1]}</td>
                      <td>{departmentOptions[response.department]}</td>
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
                                  3
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

        { showConsentModal && (

            <SendMail 
              handleClose = {handleClose}
              handleSave = {handleSave}
              newlySelectedStudents = {newlySelectedStudents}
              formType = {formType}
            />
          
          )
        }
      </div>
    </div>
  );
};

export default FormResponses;
