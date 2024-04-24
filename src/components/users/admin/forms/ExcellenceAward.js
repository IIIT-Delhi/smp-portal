import React from "react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { DownloadCSV } from "../DownloadCSV";

export default function ExcellenceAward({ handleClose, handleButtonSave }) {
  const [mentorsList, setMentorsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMentorsList, setFilteredMentorsList] = useState([]);
  const [mentorsCount, setMentorsCount] = useState(0);
  const [newlySelectedStudents, setNewlySelectedStudents] = useState([]);

  useEffect(() => {
    // Update the filtered list when the search query or mentorsList changes
    const filteredList = mentorsList.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.id.toString().includes(searchQuery)
    );
    setFilteredMentorsList(filteredList);

    const presentCount = filteredList.filter(
      (candidate) => candidate.status === 1
    ).length;
    setMentorsCount(presentCount);
  }, [searchQuery, mentorsList]);

  const fetchMentorsList = useCallback(async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/getExcellenceAward/"
      );

      if (response.status === 200) {
        setMentorsList(response.data.candidateList);
      } else {
        alert("There is some issue fetching the list. Please try again later.");
        handleClose();
      }
    } catch (error) {
      alert("There is some issue fetching the list. Please try again later.");
      handleClose();
      console.error("Error fetching mentor list for excellence award:", error);
    }
  }, [handleClose]);

  const updateExcellenceAward = async () => {
    const response1 = await axios.post(
      "http://127.0.0.1:8000/api/updateExcellenceAward/",
      JSON.stringify({
        candidateList: mentorsList,
      })
    );

    if (response1.status === 200) {
      alert("Excellence Award List Updated Succesfully");
    } else {
      alert("There is some issue saving the list. Please try again.");
      handleClose();
    }
  };

  const handleSave = () => {
    updateExcellenceAward();
    handleButtonSave();
  };

  useEffect(() => {
    // if(isFirstTime){setisFirstTime(false);fetchMeetings();}
    fetchMentorsList();
  }, [fetchMentorsList]);

  const handleCheckboxChange = (candidateId) => {
    setNewlySelectedStudents((prevNewlySelectedStudents) => {
      if (prevNewlySelectedStudents.includes(candidateId)) {
        // If candidateId is already included, remove it
        return prevNewlySelectedStudents.filter(id => id !== candidateId);
      } else {
        // If candidateId is not included, add it
        return [...prevNewlySelectedStudents, candidateId];
      }
    })

    setMentorsList((prevMentorsList) => {
      const updatedList = prevMentorsList.map((candidate) => {
        if (candidate.id === candidateId) {
          const newMentorSelected = candidate.status === 0 ? 1 : 0;
          // Update mentor count on checkbox change
          setMentorsCount(mentorsCount + (newMentorSelected - candidate.status));
          return { ...candidate, status: newMentorSelected };
        }
        return candidate;
      });

      return updatedList;
    });
  };

  return (
    <div>
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Excellence Award List</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleClose}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            {filteredMentorsList ? (
              <div className="modal-body">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name or roll number"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <p> Total Selected Mentors : {mentorsCount}</p>
                </div>
                <div className="table-header">
                  <table className="table">
                    <thead>
                      <tr style={{ width: "100%" }}>
                        <th className="text-center" style={{ width: "25%" }}>
                          Select Mentors
                        </th>
                        <th className="text-center" style={{ width: "25%" }}>
                          Roll Number
                        </th>
                        <th className="text-center" style={{ width: "25%" }}>
                          Name
                        </th>
                        <th className="text-center" style={{ width: "25%" }}>
                          Score
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>
                {/* Make the table body scrollable */}
                <div
                  className="table-body"
                  style={{ maxHeight: "60vh", overflowY: "auto" }}
                >
                  <table className="table">
                    <tbody>
                      {filteredMentorsList.map((candidate) => (
                        <tr key={candidate.id} style={{ width: "100%" }}>
                          <td className="text-center" style={{ width: "25%" }}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`excellenceAwardCheckbox${candidate.id}`}
                              checked={candidate.status === 1}
                              disabled={
                                candidate.status === 1 &&
                                !newlySelectedStudents.includes(candidate.id)
                              }
                              onChange={() =>
                                handleCheckboxChange(candidate.id)
                              }
                            />
                          </td>
                          <td className="text-center" style={{ width: "25%" }}>
                            {candidate.id}
                          </td>
                          <td className="text-center" style={{ width: "25%" }}>
                            {candidate.name}
                          </td>
                          <td className="text-center" style={{ width: "25%" }}>
                            {candidate.score}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p>Loading list of mentors....</p>
            )}

            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={handleClose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                title="Save the current selected mentors and send email to them."
              >
                Save
              </button>
              <DownloadCSV
                type={"excellenceAward"}
                list={mentorsList}
                handleExcellentListSave={handleSave}
              ></DownloadCSV>
            </div>
            <div
              className="mx-2"
              style={{ color: "red", textAlign: "center" }}
            >
              <p>
                *Saving (and downloading) will also send mail to the selected
                mentors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
