import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from "../../navbar/Navbar";
import { Form, Button, Card, Container, Row, Col, Table, Alert, Badge, Modal } from "react-bootstrap";

const AttendanceCrossCheck = () => {
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [mentorMentees, setMentorMentees] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [crossCheckResults, setCrossCheckResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/getAllMentors/");
      setMentors(response.data);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      showAlert("Error fetching mentors", "danger");
    }
  };

  const fetchMentorData = async (mentorId) => {
    try {
      setLoading(true);
      
      // Fetch mentor's mentees
      const mentorResponse = await axios.get(`http://localhost:8000/api/getMentorById/`, {
        params: { id: mentorId }
      });
      
      if (mentorResponse.data && mentorResponse.data.length > 0) {
        const mentor = mentorResponse.data[0];
        setSelectedMentor(mentor);
        setMentorMentees(mentor.menteesToMentors || []);
        
        // Fetch meetings scheduled by this mentor
        const meetingsResponse = await axios.get("http://localhost:8000/api/getMeetings/", {
          params: { schedulerId: mentorId }
        });
        setMeetings(meetingsResponse.data || []);
        
        // Fetch attendance data for all meetings
        await fetchAttendanceData(meetingsResponse.data || []);
      }
    } catch (error) {
      console.error("Error fetching mentor data:", error);
      showAlert("Error fetching mentor data", "danger");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceData = async (mentorMeetings) => {
    try {
      const attendancePromises = mentorMeetings.map(async (meeting) => {
        const response = await axios.get("http://localhost:8000/api/getAttendance/", {
          params: { meetingId: meeting.meetingId }
        });
        return {
          meetingId: meeting.meetingId,
          title: meeting.title,
          date: meeting.date,
          attendees: response.data || []
        };
      });

      const attendanceResults = await Promise.all(attendancePromises);
      setAttendanceData(attendanceResults);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      showAlert("Error fetching attendance data", "danger");
    }
  };

  const performCrossCheck = () => {
    if (!selectedMentor || !mentorMentees.length || !attendanceData.length) {
      showAlert("Insufficient data for cross-checking", "warning");
      return;
    }

    const results = [];
    
    // Cross-check each mentee's attendance
    mentorMentees.forEach(mentee => {
      const [menteeId, menteeName] = mentee;
      const menteeAttendance = {
        menteeId,
        menteeName,
        totalMeetings: attendanceData.length,
        attendedMeetings: 0,
        missedMeetings: 0,
        attendanceRate: 0,
        meetingDetails: []
      };

      attendanceData.forEach(meeting => {
        const attended = meeting.attendees.some(
          attendee => attendee.id === menteeId && attendee.attendance === 1
        );
        
        if (attended) {
          menteeAttendance.attendedMeetings++;
        } else {
          menteeAttendance.missedMeetings++;
        }

        menteeAttendance.meetingDetails.push({
          meetingId: meeting.meetingId,
          title: meeting.title,
          date: meeting.date,
          attended: attended
        });
      });

      menteeAttendance.attendanceRate = attendanceData.length > 0 
        ? Math.round((menteeAttendance.attendedMeetings / attendanceData.length) * 100)
        : 0;

      results.push(menteeAttendance);
    });

    // Sort by attendance rate (lowest first for attention)
    results.sort((a, b) => a.attendanceRate - b.attendanceRate);
    setCrossCheckResults(results);
    setShowModal(true);
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const getAttendanceBadge = (rate) => {
    if (rate >= 80) return "success";
    if (rate >= 60) return "warning";
    return "danger";
  };

  const exportAttendanceReport = () => {
    if (!crossCheckResults.length) {
      showAlert("No data to export", "warning");
      return;
    }

    const csvData = crossCheckResults.map(result => ({
      "Mentee ID": result.menteeId,
      "Mentee Name": result.menteeName,
      "Total Meetings": result.totalMeetings,
      "Attended Meetings": result.attendedMeetings,
      "Missed Meetings": result.missedMeetings,
      "Attendance Rate (%)": result.attendanceRate
    }));

    const csvContent = convertToCSV(csvData);
    downloadCSV(csvContent, `attendance_report_${selectedMentor.id}.csv`);
    showAlert("Attendance report exported successfully", "success");
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";
    const header = Object.keys(data[0]).join(",");
    const rows = data.map((entry) => Object.values(entry).join(","));
    return `${header}\n${rows.join("\n")}`;
  };

  const downloadCSV = (csvData, fileName) => {
    const blob = new Blob([csvData], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Navbar className="fixed-top" />
      <Container className="mt-5 pt-4">
        <h2 className="text-center mb-4">Attendance Cross-Check System</h2>
        
        {alert.show && (
          <Alert variant={alert.type} className="mb-4">
            {alert.message}
          </Alert>
        )}

        <Row>
          <Col md={4}>
            <Card>
              <Card.Header>
                <h5>Select Mentor</h5>
              </Card.Header>
              <Card.Body>
                <Form.Select
                  value={selectedMentor?.id || ""}
                  onChange={(e) => {
                    const mentorId = e.target.value;
                    if (mentorId) {
                      fetchMentorData(mentorId);
                    }
                  }}
                  disabled={loading}
                >
                  <option value="">Select a mentor...</option>
                  {mentors.map(mentor => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.name} ({mentor.id})
                    </option>
                  ))}
                </Form.Select>
              </Card.Body>
            </Card>
          </Col>

          <Col md={8}>
            {selectedMentor && (
              <Card>
                <Card.Header>
                  <h5>Mentor Information</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p><strong>Name:</strong> {selectedMentor.name}</p>
                      <p><strong>ID:</strong> {selectedMentor.id}</p>
                      <p><strong>Email:</strong> {selectedMentor.email}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Total Mentees:</strong> {mentorMentees.length}</p>
                      <p><strong>Total Meetings:</strong> {meetings.length}</p>
                      <p><strong>Attendance Records:</strong> {attendanceData.length}</p>
                    </Col>
                  </Row>
                  <div className="mt-3">
                    <Button 
                      variant="primary" 
                      onClick={performCrossCheck}
                      disabled={loading || !mentorMentees.length || !attendanceData.length}
                    >
                      {loading ? "Loading..." : "Perform Cross-Check"}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>

        {/* Cross-Check Results Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>
              Attendance Cross-Check Results - {selectedMentor?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Mentee Attendance Summary</h5>
              <Button variant="success" onClick={exportAttendanceReport}>
                Export Report
              </Button>
            </div>
            
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Mentee ID</th>
                  <th>Mentee Name</th>
                  <th>Total Meetings</th>
                  <th>Attended</th>
                  <th>Missed</th>
                  <th>Attendance Rate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {crossCheckResults.map((result, index) => (
                  <tr key={index}>
                    <td>{result.menteeId}</td>
                    <td>{result.menteeName}</td>
                    <td>{result.totalMeetings}</td>
                    <td>{result.attendedMeetings}</td>
                    <td>{result.missedMeetings}</td>
                    <td>{result.attendanceRate}%</td>
                    <td>
                      <Badge bg={getAttendanceBadge(result.attendanceRate)}>
                        {result.attendanceRate >= 80 ? "Good" : 
                         result.attendanceRate >= 60 ? "Average" : "Poor"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="mt-4">
              <h6>Detailed Meeting Attendance</h6>
              {crossCheckResults.map((result, resultIndex) => (
                <Card key={resultIndex} className="mb-3">
                  <Card.Header>
                    <h6>{result.menteeName} ({result.menteeId})</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      {result.meetingDetails.map((meeting, meetingIndex) => (
                        <Col key={meetingIndex} md={6} lg={4} className="mb-2">
                          <div className={`p-2 border rounded ${meeting.attended ? 'bg-light-success' : 'bg-light-danger'}`}>
                            <small>
                              <strong>{meeting.title}</strong><br/>
                              {meeting.date}<br/>
                              <Badge bg={meeting.attended ? "success" : "danger"}>
                                {meeting.attended ? "Present" : "Absent"}
                              </Badge>
                            </small>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AttendanceCrossCheck;
