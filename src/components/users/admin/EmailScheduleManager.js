import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from "../../navbar/Navbar";
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Alert, Spinner } from "react-bootstrap";

const EmailScheduleManager = () => {
  const [emailSchedules, setEmailSchedules] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    fetchEmailSchedules();
  }, []);

  const fetchEmailSchedules = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/getEmailSchedules/");
      setEmailSchedules(response.data.schedules || []);
      setSummary({
        total_schedules: response.data.total_schedules,
        pending: response.data.pending,
        in_progress: response.data.in_progress,
        completed: response.data.completed,
        failed: response.data.failed
      });
    } catch (error) {
      console.error("Error fetching email schedules:", error);
      showAlert("Error fetching email schedules", "danger");
    } finally {
      setLoading(false);
    }
  };

  const sendTodaysEmails = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/api/sendTodaysEmails/");
      showAlert(response.data.message, "success");
      fetchEmailSchedules(); // Refresh the list
    } catch (error) {
      console.error("Error sending emails:", error);
      showAlert("Error sending emails", "danger");
    } finally {
      setLoading(false);
    }
  };

  const rescheduleFailedEmails = async (scheduleIds) => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/api/rescheduleFailedEmails/", {
        schedule_ids: scheduleIds
      });
      showAlert(response.data.message, "success");
      fetchEmailSchedules(); // Refresh the list
    } catch (error) {
      console.error("Error rescheduling emails:", error);
      showAlert("Error rescheduling emails", "danger");
    } finally {
      setLoading(false);
    }
  };

  const viewEmailLogs = async (schedule) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/getEmailLogs/?schedule_id=${schedule.id}`);
      setEmailLogs(response.data.logs || []);
      setSelectedSchedule(schedule);
      setShowLogsModal(true);
    } catch (error) {
      console.error("Error fetching email logs:", error);
      showAlert("Error fetching email logs", "danger");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      in_progress: "info", 
      completed: "success",
      failed: "danger"
    };
    return variants[status] || "secondary";
  };

  const getScheduleTypeBadge = (type) => {
    const variants = {
      mentor_mapping: "primary",
      consent: "info",
      general: "secondary"
    };
    return variants[type] || "secondary";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div>
      <Navbar className="fixed-top" />
      <Container className="mt-5 pt-4">
        <h2 className="text-center mb-4">Email Schedule Manager</h2>
        
        {alert.show && (
          <Alert variant={alert.type} className="mb-4">
            {alert.message}
          </Alert>
        )}

        {/* Summary Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h5>{summary.total_schedules || 0}</h5>
                <p className="text-muted">Total Schedules</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h5 className="text-warning">{summary.pending || 0}</h5>
                <p className="text-muted">Pending</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h5 className="text-success">{summary.completed || 0}</h5>
                <p className="text-muted">Completed</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h5 className="text-danger">{summary.failed || 0}</h5>
                <p className="text-muted">Failed</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex gap-3">
              <Button 
                variant="primary" 
                onClick={sendTodaysEmails}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : null} Send Today's Emails
              </Button>
              <Button 
                variant="warning" 
                onClick={() => {
                  const failedSchedules = emailSchedules
                    .filter(s => s.status === 'failed')
                    .map(s => s.id);
                  if (failedSchedules.length > 0) {
                    rescheduleFailedEmails(failedSchedules);
                  } else {
                    showAlert("No failed schedules to reschedule", "info");
                  }
                }}
                disabled={loading}
              >
                Reschedule All Failed
              </Button>
              <Button 
                variant="secondary" 
                onClick={fetchEmailSchedules}
                disabled={loading}
              >
                Refresh
              </Button>
            </div>
          </Col>
        </Row>

        {/* Email Schedules Table */}
        <Card>
          <Card.Header>
            <h5>Email Schedules</h5>
          </Card.Header>
          <Card.Body>
            {loading && emailSchedules.length === 0 ? (
              <div className="text-center">
                <Spinner animation="border" />
                <p>Loading email schedules...</p>
              </div>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Department</th>
                    <th>Type</th>
                    <th>Scheduled Date</th>
                    <th>Email Count</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Sent At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {emailSchedules.map((schedule) => (
                    <tr key={schedule.id}>
                      <td>{schedule.id}</td>
                      <td>{schedule.department}</td>
                      <td>
                        <Badge bg={getScheduleTypeBadge(schedule.schedule_type)}>
                          {schedule.schedule_type.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td>{formatDate(schedule.scheduled_date)}</td>
                      <td>{schedule.email_count}</td>
                      <td>
                        <Badge bg={getStatusBadge(schedule.status)}>
                          {schedule.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td>{formatDateTime(schedule.created_at)}</td>
                      <td>{schedule.sent_at ? formatDateTime(schedule.sent_at) : '-'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button 
                            size="sm" 
                            variant="info"
                            onClick={() => viewEmailLogs(schedule)}
                          >
                            View Logs
                          </Button>
                          {schedule.status === 'failed' && (
                            <Button 
                              size="sm" 
                              variant="warning"
                              onClick={() => rescheduleFailedEmails([schedule.id])}
                            >
                              Reschedule
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Email Logs Modal */}
        <Modal show={showLogsModal} onHide={() => setShowLogsModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Email Logs - {selectedSchedule?.department} ({selectedSchedule?.schedule_type})
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Sent At</th>
                  <th>Status</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {emailLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.recipient_email}</td>
                    <td>{formatDateTime(log.sent_at)}</td>
                    <td>
                      <Badge bg={log.success ? "success" : "danger"}>
                        {log.success ? "SUCCESS" : "FAILED"}
                      </Badge>
                    </td>
                    <td>{log.error_message || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowLogsModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default EmailScheduleManager;
