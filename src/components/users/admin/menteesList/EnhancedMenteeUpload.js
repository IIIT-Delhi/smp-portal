import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement("#root");

const EnhancedMenteeUpload = ({ closeModal, isOpen }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [step, setStep] = useState(1); // 1: Archive confirmation, 2: File upload
  const [archiving, setArchiving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [academicYear, setAcademicYear] = useState(() => {
    const currentYear = new Date().getFullYear();
    return `${currentYear}-${currentYear + 1}`;
  });

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleArchiveAndProceed = async () => {
    const confirmArchive = window.confirm(
      `This will archive all current mentors and mentees to historical data for academic year ${academicYear}. Do you want to proceed?`
    );
    
    if (!confirmArchive) return;

    const clearCurrent = window.confirm(
      "Do you want to clear the current tables after archiving? (Recommended for new batch upload)"
    );

    try {
      setArchiving(true);
      const response = await axios.post("http://localhost:8000/api/archiveCurrentData/", {
        academic_year: academicYear,
        semester: "Even",
        archived_by: "Admin",
        clear_current: clearCurrent
      });

      alert(
        `Data archived successfully!\n` +
        `Mentors: ${response.data.archived_counts.mentors}\n` +
        `Mentees: ${response.data.archived_counts.mentees}\n` +
        `Candidates: ${response.data.archived_counts.candidates}`
      );
      
      setStep(2);
    } catch (error) {
      console.error("Error archiving data:", error);
      alert("Error archiving data: " + (error.response?.data?.error || error.message));
    } finally {
      setArchiving(false);
    }
  };

  const handleSkipArchive = () => {
    const confirmSkip = window.confirm(
      "Are you sure you want to skip archiving? This will add new mentees to the current data without backing up existing data."
    );
    if (confirmSkip) {
      setStep(2);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a CSV file first.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("csvFile", selectedFile);

      await axios.post("http://localhost:8000/api/uploadCSV/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      alert("File uploaded successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading file", error);
      alert("Error uploading file: " + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }

    closeModal();
  };

  const isValidFileType = (fileName) => {
    const acceptedFileTypes = ["csv"];
    const fileType = fileName.split(".").pop().toLowerCase();
    return acceptedFileTypes.includes(fileType);
  };

  const handleFileValidation = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const fileName = file.name;
    if (!isValidFileType(fileName)) {
      alert("Please select a CSV file.");
      e.target.value = null;
      setSelectedFile(null);
    } else {
      setSelectedFile(file);
    }
  };

  const resetModal = () => {
    setStep(1);
    setSelectedFile(null);
    setArchiving(false);
    setUploading(false);
  };

  const handleCloseModal = () => {
    resetModal();
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel="Upload Mentees CSV"
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          maxHeight: "80vh",
          borderRadius: "12px",
          border: "none",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)"
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 1000
        }
      }}
    >
      <div style={{ padding: "20px" }}>
        {step === 1 ? (
          // Step 1: Archive Confirmation
          <>
            <h2 style={{ color: "var(--primary-dark-blue)", marginBottom: "20px" }}>
              Upload New Mentees
            </h2>
            
            <div style={{ 
              backgroundColor: "var(--light-gray)", 
              padding: "15px", 
              borderRadius: "8px",
              marginBottom: "20px"
            }}>
              <h6 style={{ color: "var(--warning)", marginBottom: "10px" }}>
                ⚠️ Important: Data Archival
              </h6>
              <p style={{ fontSize: "0.9rem", color: "var(--gray)", marginBottom: "0" }}>
                Before uploading new mentees, we recommend archiving your current data to preserve historical records.
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontWeight: "600", marginBottom: "8px", display: "block" }}>
                Academic Year for Archive:
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="e.g., 2024-2025"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "2px solid var(--light-gray)",
                  borderRadius: "6px",
                  fontSize: "1rem"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={handleSkipArchive}
                disabled={archiving}
                style={{
                  backgroundColor: "var(--gray)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 20px",
                  cursor: archiving ? "not-allowed" : "pointer",
                  opacity: archiving ? 0.6 : 1
                }}
              >
                Skip Archive
              </button>
              <button
                onClick={handleArchiveAndProceed}
                disabled={archiving}
                style={{
                  backgroundColor: "var(--warning)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 20px",
                  cursor: archiving ? "not-allowed" : "pointer",
                  opacity: archiving ? 0.6 : 1
                }}
              >
                {archiving ? "Archiving..." : "Archive & Continue"}
              </button>
              <button
                onClick={handleCloseModal}
                disabled={archiving}
                style={{
                  backgroundColor: "var(--light-gray)",
                  color: "var(--gray)",
                  border: "2px solid var(--gray)",
                  borderRadius: "6px",
                  padding: "10px 20px",
                  cursor: archiving ? "not-allowed" : "pointer",
                  opacity: archiving ? 0.6 : 1
                }}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          // Step 2: File Upload
          <>
            <h2 style={{ color: "var(--primary-dark-blue)", marginBottom: "20px" }}>
              Upload CSV File
            </h2>

            <div style={{ 
              backgroundColor: "var(--success-light)", 
              padding: "10px", 
              borderRadius: "6px",
              marginBottom: "20px",
              fontSize: "0.9rem",
              color: "var(--success)"
            }}>
              ✅ Data archived successfully! You can now upload the new mentees CSV.
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontWeight: "600", marginBottom: "8px", display: "block" }}>
                Select CSV File:
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  handleFileChange(e);
                  handleFileValidation(e);
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "2px solid var(--light-gray)",
                  borderRadius: "6px",
                  fontSize: "1rem"
                }}
              />
              {selectedFile && (
                <p style={{ fontSize: "0.9rem", color: "var(--success)", marginTop: "5px" }}>
                  ✅ Selected: {selectedFile.name}
                </p>
              )}
            </div>

            <div style={{ 
              backgroundColor: "var(--light-gray)", 
              padding: "10px", 
              borderRadius: "6px",
              marginBottom: "20px",
              fontSize: "0.8rem",
              color: "var(--gray)"
            }}>
              <strong>CSV Format Requirements:</strong><br />
              • Headers: Roll, Name, Program, Branch, Email, Contact<br />
              • Program: B.Tech. or M.Tech.<br />
              • Ensure no duplicate roll numbers
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setStep(1)}
                disabled={uploading}
                style={{
                  backgroundColor: "var(--light-gray)",
                  color: "var(--gray)",
                  border: "2px solid var(--gray)",
                  borderRadius: "6px",
                  padding: "10px 20px",
                  cursor: uploading ? "not-allowed" : "pointer",
                  opacity: uploading ? 0.6 : 1
                }}
              >
                Back
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                style={{
                  backgroundColor: selectedFile && !uploading ? "var(--success)" : "var(--gray)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 20px",
                  cursor: selectedFile && !uploading ? "pointer" : "not-allowed",
                  opacity: selectedFile && !uploading ? 1 : 0.6
                }}
              >
                {uploading ? "Uploading..." : "Upload CSV"}
              </button>
              <button
                onClick={handleCloseModal}
                disabled={uploading}
                style={{
                  backgroundColor: "var(--light-gray)",
                  color: "var(--gray)",
                  border: "2px solid var(--gray)",
                  borderRadius: "6px",
                  padding: "10px 20px",
                  cursor: uploading ? "not-allowed" : "pointer",
                  opacity: uploading ? 0.6 : 1
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default EnhancedMenteeUpload;
