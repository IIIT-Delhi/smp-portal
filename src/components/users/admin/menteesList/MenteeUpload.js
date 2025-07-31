// MenteeUpload.js
import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement("#root");

const MenteeUpload = ({ closeModal }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("csvFile", selectedFile);

      // console.log(typeof formData);
      // console.log(selectedFile);

      try {
        await axios.post("http://localhost:8000/api/uploadCSV/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("File uploaded successfully");
        window.location.reload();
      } catch (error) {
        console.error("Error uploading file", error);
      }

      closeModal();
    }
  };
  const isValidFileType = (fileName) => {
    const acceptedFileTypes = ["csv"];
    const fileType = fileName.split(".").pop();
    return acceptedFileTypes.includes(fileType);
  };

  const handleFileValidation = (e) => {
    const fileName = e.target.files[0].name;
    if (!isValidFileType(fileName)) {
      alert("Please select a CSV file.");
      e.target.value = null; // Clear the file input
    }
  };

  return (
    <div>
      <div
        className="modal"
        tabIndex="-1"
        role="dialog"
        style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Upload Mentee New CSV</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {/* your code here */}

              <div className="form-group mb-3">
                <label className="mx-2" htmlFor="csvFile">
                  Select CSV File
                </label>
                <input
                  type="file"
                  className="form-control-file"
                  id="csvFile"
                  accept=".csv"
                  onChange={(e) => {
                    handleFileChange(e);
                    handleFileValidation(e);
                  }}
                />
                <label className="mx-2" htmlFor="csvFile">
                  This will replace the current list with new CSV. Please click
                  on download to save current details locally.
                  <br />
                  The CSV file should have the following columns:
                  <br />
                  Roll | Name | Email | Contact | Department
                  <br />
                  (Format for the department should be B-CSE for B.Tech CSE and for M.Tech CSB use M-CB)
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpload}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeUpload;
