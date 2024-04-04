import { React, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SendMail({
  handleClose,
  setLoading,
  handleSave,
  newlySelectedStudents,
  formType,
  fetchFormResponses
}) {
  const navigate = useNavigate();
  const [mailSubject, setmailSubject] = useState("");
  const [mailBody, setmailBody] = useState("");
  const [editMode, setEditMode] = useState(false);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSaveChanges = () => {
    setEditMode(false);
    // Add logic to save changes to the backend if needed
  };

  const sendConsentMail = async () => {
    try {
      const response1 = await axios.post(
        "http://127.0.0.1:8000/sendConsentForm/",
        JSON.stringify({
          subject: mailSubject,
          body: mailBody,
          Id: newlySelectedStudents,
        })
      );

      if (response1.status === 200) {
        alert("Mailed Send succesfully");
      } else {
        alert(response1.data.message);
      }
    } catch (error) {
      alert("Invalid Selection.");
    }
  };

  const handleMentorMenteeMapping = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/createMentorMenteePair/",
        JSON.stringify({
          subject: mailSubject,
          body: mailBody,
          Id: newlySelectedStudents,
        })
      );
      if (response.status === 200) {
        alert("Mentor-Mentee Mapping is completed!");
        navigate("/users/admin/mentors");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error calling Mentor-Mentee Mapping API:", error);
      alert("Invalid Selection.");
    }
    setLoading(false);
  };

  const handlModalSave = async () => {
    if (formType === "1") {
      await sendConsentMail();
    } else {
      await handleMentorMenteeMapping();
    }
    handleSave();
  };

  const fetchMailDetails = useCallback(async (formType) => {
    try {
      //   console.log(userDetails)
      var key = "";
      if (formType === "1") {
        key = "consent";
      } else {
        key = "mapping";
      }
      const response = await axios.post(
        "http://127.0.0.1:8000/getMailSubjectAndBody/",
        JSON.stringify({
          type: key,
        })
      );

      if (response.status === 200) {
        setmailBody(response.data.body);
        setmailSubject(response.data.subject);
      }
    } catch (error) {
      console.error("Error fetching Mail Content:", error);
    }
  }, []);

  useEffect(() => {
    fetchMailDetails(formType);
  }, [fetchMailDetails]);

  return (
    <div>
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {formType === "1"
                  ? "Consent Mail"
                  : "Mentor-Mentee Mapping Mail"}
              </h5>
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

            <div className="modal-body">
              {editMode ? (
                <>
                  <div className="form-group">
                    <label htmlFor="mailSubject">Mail Subject:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="mailSubject"
                      value={mailSubject}
                      onChange={(e) => setmailSubject(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="mailBody">Mail Body:</label>
                    <textarea
                      className="form-control"
                      id="mailBody"
                      rows={7}
                      value={mailBody}
                      onChange={(e) => setmailBody(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <p>
                    <strong>Mail Subject:</strong> {mailSubject}
                  </p>
                  <p>
                    <strong>Mail Body:</strong> {mailBody}
                  </p>
                </>
              )}
            </div>

            <div className="modal-footer">
              {editMode ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEdit}
                >
                  Edit
                </button>
              )}
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
                onClick={handlModalSave}
                disabled={editMode ? true : false}
              >
                Send Mail
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
