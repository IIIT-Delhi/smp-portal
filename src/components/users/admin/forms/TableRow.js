import React from "react";
import { truncateText } from "./utils";

const TableRow = ({
  response,
  formType,
  handleCheckboxChangeWrapper,
  departmentOptions,
  getAnswerForQuestion,
  expandedResponse,
  handleExpandResponse,
  newlySelectedStudents,
}) => {

  const isMappingStatusNegativeOne = response.mapping_status === -1;
  const rowStyle = isMappingStatusNegativeOne ? { backgroundColor: 'black' } : {};

  return (
    <tr>
      {formType !== "3" && (
        <td className="text-center">
          {isMappingStatusNegativeOne ? (
            <span style={{color : 'red'}}>&#10006;</span> // Cross sign
          ):(
          <input
            className="form-check-input"
            type="checkbox"
            id={response.submitterId}
            checked={
              formType === "1"
                ? (response.consent_status === 1)
                : response.mapping_status === 1
            }
            disabled={
              (((response.consent_status === 1) && formType === "1") ||
              ((response.mapping_status === 1 || response.mapping_status===-1) && formType === "2" ))&&
                !newlySelectedStudents.includes(response.submitterId)
            }
            onChange={() =>
              handleCheckboxChangeWrapper(response.submitterId, formType)
            }
            style={rowStyle}
          />
          )}
        </td>
      )}
      <td>{response.submitterId}</td>
      <td>{response.submitterName}</td>
      <td>{response.submitterEmail}</td>
      <td>{response.Contact}</td>
      {formType !== "3" && <td>{response.Year[1]}</td>}
      <td>{departmentOptions[response.department]}</td>
      {formType === "3" && <td>{response.mentorId}</td>}
      {formType === "3" && <td>{response.mentorName}</td>}
      {formType === "3" && <td>{response.mentorEmail}</td>}
      {formType === "3" && (
        <td>{departmentOptions[response.mentorDepartment]}</td>
      )}
      {formType === "3" && <td>{response.mentorYear[1]}</td>}
      {Object.keys(response.responses).map((key, idx) => (
        <td key={idx}>
          <span
            className="truncated"
            title={getAnswerForQuestion(key, response, formType)}
            onClick={() => handleExpandResponse(idx)}
            style={{ cursor: "pointer" }}
          >
            {expandedResponse === idx
              ? getAnswerForQuestion(key, response, formType)
              : truncateText(getAnswerForQuestion(key, response, formType), 3)}
          </span>
        </td>
      ))}
    </tr>
  );
};

export default TableRow;
