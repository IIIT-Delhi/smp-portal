export const handleSort = (
  option,
  filteredResponses,
  setFilteredResponses,
  setSortOption
) => {
  // Perform sorting logic based on the selected option
  let sortedResponses = [...filteredResponses];
  setSortOption(option);

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
      sortedResponses.sort((a, b) => b.responses.fq2 - a.responses.fq2);
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
      sortedResponses.sort((a, b) => a.response.mentorId - b.response.mentorId);
      break;
    case "mentor-id-max-to-min":
      sortedResponses.sort((a, b) => b.response.mentorId - a.response.mentorId);
      break;
    default:
      break;
  }

  setFilteredResponses(sortedResponses);
};

export const handleCheckboxChange = (
  studentId,
  formType,
  filteredResponses,
  setFilteredResponses,
  newlySelectedStudents,
  setNewlySelectedStudents
) => {
  setFilteredResponses((prevResponse) => {
    return prevResponse.map((response) => {
      if (response.submitterId === studentId) {
        if (formType === "1") {
          return {
            ...response,
            consent_status: response.consent_status === 0 ? 1 : 0,
          };
        } else {
          return {
            ...response,
            mapping_status: response.mapping_status === 0 ? 1 : 0,
          };
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

