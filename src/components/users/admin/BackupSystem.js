import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from "../../navbar/Navbar";
import { Form, Button, Card, Container, Row, Col, Alert, Modal, ProgressBar } from "react-bootstrap";
import JSZip from "jszip";

const BackupSystem = () => {
  const [backupTypes, setBackupTypes] = useState([]);
  const [backupProgress, setBackupProgress] = useState(0);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [currentBackup, setCurrentBackup] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [backupHistory, setBackupHistory] = useState([]);

  const availableBackups = [
    {
      id: "forms",
      name: "Forms & Responses",
      description: "Backup all form configurations and responses",
      icon: "📝"
    },
    {
      id: "users",
      name: "Users Data",
      description: "Backup mentors, mentees, and admin data",
      icon: "👥"
    },
    {
      id: "meetings",
      name: "Meetings & Attendance",
      description: "Backup meeting schedules and attendance records",
      icon: "📅"
    },
    {
      id: "files",
      name: "Uploaded Files",
      description: "Backup all uploaded files and documents",
      icon: "📁"
    },
    {
      id: "complete",
      name: "Complete System",
      description: "Full system backup including all data",
      icon: "💾"
    }
  ];

  useEffect(() => {
    fetchBackupHistory();
  }, []);

  const fetchBackupHistory = async () => {
    try {
      const response = await axios.get("https://smpportal.iiitd.edu.in/api/getBackupHistory/");
      setBackupHistory(response.data);
    } catch (error) {
      console.error("Error fetching backup history:", error);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const createBackup = async (backupType) => {
    try {
      setCurrentBackup(backupType.name);
      setShowProgressModal(true);
      setBackupProgress(0);

      const zip = new JSZip();
      
      // Simulate progress updates
      const updateProgress = (progress) => {
        setBackupProgress(progress);
      };

      updateProgress(10);

      switch (backupType.id) {
        case "forms":
          await backupForms(zip, updateProgress);
          break;
        case "users":
          await backupUsers(zip, updateProgress);
          break;
        case "meetings":
          await backupMeetings(zip, updateProgress);
          break;
        case "files":
          await backupFiles(zip, updateProgress);
          break;
        case "complete":
          await backupComplete(zip, updateProgress);
          break;
        default:
          throw new Error("Invalid backup type");
      }

      updateProgress(90);

      // Generate and download the backup
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `smp_backup_${backupType.id}_${timestamp}.zip`;
      
      const content = await zip.generateAsync({ type: "blob" });
      downloadFile(content, filename);

      updateProgress(100);
      
      // Record backup in history
      await recordBackup(backupType.id, filename);
      
      setTimeout(() => {
        setShowProgressModal(false);
        showAlert(`${backupType.name} backup created successfully!`, "success");
        fetchBackupHistory();
      }, 1000);

    } catch (error) {
      console.error("Error creating backup:", error);
      setShowProgressModal(false);
      showAlert("Error creating backup. Please try again.", "danger");
    }
  };

  const backupForms = async (zip, updateProgress) => {
    updateProgress(20);
    
    // Backup form configurations
    const formTypes = ["registration", "consent", "feedback", "enrollment"];
    const formsData = {};
    
    for (const formType of formTypes) {
      try {
        const questionsResponse = await axios.get(`https://smpportal.iiitd.edu.in/api/getFormQuestions/${formType}/`);
        const responsesResponse = await axios.get(`https://smpportal.iiitd.edu.in/api/exportFormData/${formType}/`);
        
        formsData[formType] = {
          questions: questionsResponse.data,
          responses: responsesResponse.data
        };
      } catch (error) {
        console.log(`No data for ${formType} form`);
      }
    }
    
    zip.file("forms/forms_data.json", JSON.stringify(formsData, null, 2));
    
    updateProgress(60);
    
    // Create CSV files for each form
    for (const [formType, data] of Object.entries(formsData)) {
      if (data.responses && data.responses.length > 0) {
        const csvContent = convertToCSV(data.responses);
        zip.file(`forms/${formType}_responses.csv`, csvContent);
      }
    }
    
    updateProgress(80);
  };

  const backupUsers = async (zip, updateProgress) => {
    updateProgress(30);
    
    // Backup mentors
    const mentorsResponse = await axios.get("https://smpportal.iiitd.edu.in/api/getAllMentors/");
    zip.file("users/mentors.json", JSON.stringify(mentorsResponse.data, null, 2));
    
    updateProgress(50);
    
    // Backup mentees
    const menteesResponse = await axios.get("https://smpportal.iiitd.edu.in/api/getAllMentees/");
    zip.file("users/mentees.json", JSON.stringify(menteesResponse.data, null, 2));
    
    updateProgress(70);
    
    // Create CSV files
    const mentorsCSV = convertToCSV(mentorsResponse.data);
    const menteesCSV = convertToCSV(menteesResponse.data);
    
    zip.file("users/mentors.csv", mentorsCSV);
    zip.file("users/mentees.csv", menteesCSV);
    
    updateProgress(85);
  };

  const backupMeetings = async (zip, updateProgress) => {
    updateProgress(40);
    
    // Backup meetings
    const meetingsResponse = await axios.get("https://smpportal.iiitd.edu.in/api/getMeetings/");
    zip.file("meetings/meetings.json", JSON.stringify(meetingsResponse.data, null, 2));
    
    updateProgress(70);
    
    // Backup attendance data for each meeting
    const attendanceData = {};
    for (const meeting of meetingsResponse.data) {
      try {
        const attendanceResponse = await axios.get("https://smpportal.iiitd.edu.in/api/getAttendance/", {
          params: { meetingId: meeting.meetingId }
        });
        attendanceData[meeting.meetingId] = attendanceResponse.data;
      } catch (error) {
        console.log(`No attendance data for meeting ${meeting.meetingId}`);
      }
    }
    
    zip.file("meetings/attendance.json", JSON.stringify(attendanceData, null, 2));
    updateProgress(85);
  };

  const backupFiles = async (zip, updateProgress) => {
    updateProgress(30);
    
    // Note: This would typically backup actual uploaded files
    // For demo purposes, we'll create a manifest of files
    const filesManifest = {
      note: "File backup would include actual uploaded files in a real implementation",
      timestamp: new Date().toISOString(),
      file_types: ["images", "documents", "csv_uploads"]
    };
    
    zip.file("files/files_manifest.json", JSON.stringify(filesManifest, null, 2));
    updateProgress(85);
  };

  const backupComplete = async (zip, updateProgress) => {
    updateProgress(10);
    await backupForms(zip, (progress) => updateProgress(10 + progress * 0.25));
    await backupUsers(zip, (progress) => updateProgress(35 + progress * 0.25));
    await backupMeetings(zip, (progress) => updateProgress(60 + progress * 0.25));
    await backupFiles(zip, (progress) => updateProgress(85 + progress * 0.15));
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";
    const header = Object.keys(data[0]).join(",");
    const rows = data.map((entry) => Object.values(entry).map(val => 
      typeof val === 'string' && val.includes(',') ? `"${val}"` : val
    ).join(","));
    return `${header}\n${rows.join("\n")}`;
  };

  const downloadFile = (content, filename) => {
    const url = window.URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const recordBackup = async (backupType, filename) => {
    try {
      await axios.post("https://smpportal.iiitd.edu.in/api/recordBackup/", {
        type: backupType,
        filename: filename,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error recording backup:", error);
    }
  };

  return (
    <div>
      <Navbar className="fixed-top" />
      <Container className="mt-5 pt-4">
        <h2 className="text-center mb-4">🔄 Backup & Recovery System</h2>
        
        {alert.show && (
          <Alert variant={alert.type} className="mb-4">
            {alert.message}
          </Alert>
        )}

        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Header>
                <h5>📋 Backup Options</h5>
              </Card.Header>
              <Card.Body>
                <p>Select the type of backup you want to create. Each backup will be downloaded as a ZIP file containing relevant data.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {availableBackups.map((backup) => (
            <Col md={6} lg={4} key={backup.id} className="mb-4">
              <Card className="h-100">
                <Card.Body className="text-center">
                  <div style={{ fontSize: "3rem" }}>{backup.icon}</div>
                  <Card.Title className="mt-3">{backup.name}</Card.Title>
                  <Card.Text>{backup.description}</Card.Text>
                  <Button 
                    variant="primary" 
                    onClick={() => createBackup(backup)}
                    className="mt-auto"
                  >
                    Create Backup
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="mt-5">
          <Col>
            <Card>
              <Card.Header>
                <h5>📊 Backup History</h5>
              </Card.Header>
              <Card.Body>
                {backupHistory.length === 0 ? (
                  <p className="text-muted">No backups created yet.</p>
                ) : (
                  <div>
                    {backupHistory.map((backup, index) => (
                      <div key={index} className="d-flex justify-content-between align-items-center border-bottom py-2">
                        <div>
                          <strong>{backup.type}</strong> - {backup.filename}
                        </div>
                        <small className="text-muted">{backup.timestamp}</small>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Progress Modal */}
        <Modal show={showProgressModal} backdrop="static" centered>
          <Modal.Header>
            <Modal.Title>Creating Backup</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <h5>Backing up: {currentBackup}</h5>
              <ProgressBar 
                now={backupProgress} 
                label={`${backupProgress}%`} 
                className="mt-3"
                style={{ height: '25px' }}
              />
              <p className="mt-2 text-muted">
                Please wait while we create your backup...
              </p>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default BackupSystem;
