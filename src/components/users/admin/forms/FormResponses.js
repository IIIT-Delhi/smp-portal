import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../../../navbar/Navbar";
import { useLocation } from "react-router-dom";
import TableRow from "./TableRow";
import formNames from "../../../../data/formNames.json";
import departmentOptions from "../../../../data/departmentOptions.json";
import SendMail from "./SendMail";
import ExcellenceAward from "./ExcellenceAward";
import { Form } from "react-bootstrap";
import {
  getQuestionSet,
  statusOptions,
  getAnswerForQuestion,
  truncateText,
} from "./utils";

import { handleSort, handleCheckboxChange, handleSelectAll } from "./handleUtils";

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
  const [topEntries, setTopEntries] = useState("");
  const [showMentorList, setShowMentorList] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Update filtered total entries when filteredMentors change
    setTotalEntries(filteredResponses.length);
  }, [filteredResponses]);

  const fetchFormResponses = useCallback(async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/getFormResponse/",
        {
          formType: formType,
        }
      );
      setFormResponses(response.data.formResponses);
      console.log(response.data.formResponses)
    } catch (error) {
      console.error("Error fetching form responses:", error);
    }
  }, [formType]);

  useEffect(() => {

    fetchFormResponses();
  }, [formType]);

  useEffect(() => {
    setQuestionSet(getQuestionSet(formType)["questions"]);
    let filtered;
    if (topEntries > 0) {
      filtered = [...filteredResponses]; // Start with filteredResponses
      console.log("These are ECE students in top 2 people");
    } else {
      filtered = [...formResponses]; // Start with formResponses
    }
    filtered = filtered.filter((response) => {
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

    if (sortOption !== "default") {
      handleSort(sortOption, filtered, setFilteredResponses, setSortOption);
    } else {
      setFilteredResponses(filtered);
    }

    // Check if topEntries is greater than zero and apply filtering
    if (topEntries > 0) {
      let updatedFilteredResponses = [...filtered]; // Create a copy of filtered responses
      updatedFilteredResponses = updatedFilteredResponses.slice(0, topEntries);
      setFilteredResponses(updatedFilteredResponses);
    }
  }, [
    formResponses,
    searchTerm,
    formType,
    selectedDepartmentFilter,
    selectedStatusFilter,
    topEntries,
  ]);

  const handleShowMentorList = () => {
    setShowMentorList(true);
  };

  const handleCloseMentorList = () => {
    setShowMentorList(false);
  };

  const handleSaveMentorList = () => {
    setShowMentorList(false);
  };

  const handleExpandQuestion = (index) => {
    setExpandedQuestion((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleExpandResponse = (index) => {
    setExpandedResponse((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMentorMenteeMapping = async () => {
    setLoading(true);
    setshowConsentModal(true);
  };

  const handleClose = () => {
    setshowConsentModal(false);
    setLoading(false);
  };

  const handleSave = () => {
    setshowConsentModal(false);
    setLoading(false);
    window.location.reload()
  };

  const handleSendConsentEmail = async () => {
    setshowConsentModal(true);
    setLoading(false);
  };

  const handleExcellenceClicked = async () => {
    handleShowMentorList();
    console.log("Excellence award clicked.");
  };

  const handleCheckboxChangeWrapper = (studentId, formType) => {
    handleCheckboxChange(
      studentId,
      formType,
      filteredResponses,
      setFilteredResponses,
      newlySelectedStudents,
      setNewlySelectedStudents,
    );
  };

  const Button = ({ onClick, disabled, text }) => (
    <div className="input-group-append" style={{ marginLeft: "auto" }}>
      <button
        className="btn btn-outline-dark"
        data-mdb-ripple-color="dark"
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </button>
    </div>
  );

  const changeSelectAllType = () => {
    setSelectAll((prevSelectAll) => {
      // Toggle the select all state
      const newSelectAll = !prevSelectAll;

      // Return the new select all state
      return newSelectAll;
    });
  };

  useEffect(() => {
    // This effect will be triggered after the component re-renders
    // It ensures that the state update from setSelectAll has been applied
    handleSelectAll(selectAll, setFilteredResponses, setNewlySelectedStudents, newlySelectedStudents, formType);
  }, [selectAll]); // Only re-run the effect if selectAll changes

  // Call the changeSelectAllType function whenever needed


  return (
    <div>
      <Navbar className="fixed-top" />
      <div className="container mt-3">
        <h4 className="text-center mb-4">{formNames[formType]}</h4>
        <div className="input-group mt-3 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="input-group-append mx-2">
            <input
              type="text"
              className="form-control"
              placeholder="Top Entries (Number)"
              value={topEntries}
              onChange={(e) => setTopEntries(e.target.value)}
            />
          </div>
          <div className="input-group-append mx-2">
            <Form.Select
              value={selectedDepartmentFilter}
              onChange={(e) => setSelectedDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {Object.keys(departmentOptions).map((department) => (
                <option key={department} value={department}>
                  {departmentOptions[department]}
                </option>
              ))}
            </Form.Select>
          </div>
          {formType === "2" && (
            <div className="input-group-append mx-2">
              <Form.Select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                {Object.keys(statusOptions).map((status) => (
                  <option key={status} value={status}>
                    {statusOptions[status]}
                  </option>
                ))}
              </Form.Select>
            </div>
          )}
          {["1", "3"].includes(formType) && (
            <div className="input-group-append mx-2">
              <Form.Select
                value={sortOption}
                onChange={(e) =>
                  handleSort(
                    e.target.value,
                    filteredResponses,
                    setFilteredResponses,
                    setSortOption
                  )
                }
              >
                <option value="default" disabled>
                  Sort By
                </option>
                <option value="submitter-id-min-to-max">
                  Submitter Id (Min to Max)
                </option>
                <option value="submitter-id-max-to-min">
                  Submitter Id (Max to Min)
                </option>
                {formType === "1" && (
                  <>
                    <option value="score-max-to-min">Score (Max to Min)</option>
                    <option value="score-min-to-max">Score (Min to Max)</option>
                  </>
                )}
                {formType === "3" && (
                  <>
                    <option value="meetings-min-to-max">
                      Meetings (Min to Max)
                    </option>
                    <option value="meetings-max-to-min">
                      Meetings (Max to Min)
                    </option>
                    <option value="treats-min-to-max">
                      Treats (Min to Max)
                    </option>
                    <option value="treats-max-to-min">
                      Treats (Max to Min)
                    </option>
                  </>
                )}
              </Form.Select>
            </div>
          )}
          {formType === "2" && (
            <Button
              onClick={handleMentorMenteeMapping}
              disabled={loading}
              text="Mentor-Mentee Mapping"
            />
          )}
          {formType === "3" && (
            <Button
              onClick={handleExcellenceClicked}
              disabled={loading}
              text="Excellence Award List"
            />
          )}
          {formType === "1" && (
            <Button onClick={handleSendConsentEmail} text="Send Consent Form" />
          )}
        </div>
        <p className="mb-2" style={{ color: "red" }}>
          * Note: The order of applied filters may affect the results. Please be
          careful when applying filters.
        </p>
        <p>Total Entries: {totalEntries}</p>
        {filteredResponses.length === 0 ? (
          <p>No responses found for this form.</p>
        ) : (
          <div
            className="table-container text-left"
            style={{ overflow: "auto", maxHeight: "400px" }}
          >
            <div className="table-responsive">
              {formType !== '3' && (
                <div>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={'all'}
                    checked={selectAll}
                    onChange={changeSelectAllType}
                    style={{ marginRight: '0.75rem', marginLeft: '0.50rem' }}
                  />
                  Select All
                </div>
              )}
              <table className="table table-bordered table-hover">
                <thead className="thead-light">
                  <tr>
                    {formType !== "3" && (
                      <th className="text-center">Select Student</th>
                    )}
                    <th>Roll Number</th>
                    {formType !== "3" && <th>Applicant Name</th>}
                    {formType === "3" && <th>Mentee Name</th>}
                    <th>Email</th>
                    <th>Contact</th>
                    {formType !== "3" && <th>Year</th>}
                    <th>Department</th>
                    {formType === "3" && <th>Mentor Id</th>}
                    {formType === "3" && <th>Mentor Name</th>}
                    {formType === "3" && <th>Mentor Email</th>}
                    {formType === "3" && <th>Mentor Department</th>}
                    {formType === "3" && <th>Mentor Year</th>}
                    {questionSet.map((question, index) => (
                      <th key={index} className="text-center">
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
                    {formType === "1" && <th>Score</th>}
                    {formType === "2" && <th>Status</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredResponses.map((response, index) => (
                    <TableRow
                      key={index}
                      response={response}
                      formType={formType}
                      handleCheckboxChangeWrapper={handleCheckboxChangeWrapper}
                      departmentOptions={departmentOptions}
                      getAnswerForQuestion={getAnswerForQuestion}
                      expandedResponse={expandedResponse}
                      handleExpandResponse={handleExpandResponse}
                      newlySelectedStudents={newlySelectedStudents}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {showConsentModal && (
          <SendMail
            handleClose={handleClose}
            handleSave={handleSave}
            newlySelectedStudents={newlySelectedStudents}
            formType={formType}
            fetchFormResponses={fetchFormResponses}
            setLoading={setLoading}
          />
        )}
        {showMentorList && (
          <ExcellenceAward
            handleClose={handleCloseMentorList}
            handleButtonSave={handleSaveMentorList}
          />
        )}
      </div>
    </div>
  );
};

export default FormResponses;
