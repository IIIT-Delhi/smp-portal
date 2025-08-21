import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../navbar/Navbar";
import { Form, Button, Card, Container, Row, Col, Modal, Alert } from "react-bootstrap";

// Import the JSON data files
import registrationQuestions from "../../../data/registrationQuestions.json";
import consentQuestions from "../../../data/consentQuestions.json";
import menteeFeedbackQuestions from "../../../data/menteeFeedbackQuestions.json";

const FormManagement = () => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState({
    id: "",
    question: "",
    type: "text",
    options: [],
    required: true,
    correctAnswer: null
  });
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // Form types configuration with JSON data mapping
  const formTypes = [
    {
      id: "registration",
      name: "Registration Form",
      description: "Student registration form with scenario-based questions",
      jsonData: registrationQuestions
    },
    {
      id: "consent",
      name: "Consent Form",
      description: "Student consent form with agreement questions",
      jsonData: consentQuestions
    },
    {
      id: "feedback",
      name: "Feedback Form",
      description: "Mentee feedback form for mentor evaluation",
      jsonData: menteeFeedbackQuestions
    },
  ];

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      // Since we're using JSON-based forms, we don't need to fetch from database
      // Just use the hardcoded formTypes array
      setForms(formTypes);
    } catch (error) {
      console.error("Error fetching forms:", error);
      showAlert("Error fetching forms", "danger");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (formType) => {
    try {
      // Find the form type configuration
      const formConfig = formTypes.find(ft => ft.id === formType);

      if (formConfig && formConfig.jsonData) {
        // Load questions from JSON API for JSON-based forms
        const response = await axios.get(`http://localhost:8000/api/json/getFormQuestions/${formType}/`);
        setQuestions(response.data);
      } else {
        // For forms without JSON data, show empty state
        setQuestions([]);
        showAlert("This form type doesn't have JSON data configured", "info");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      showAlert("Error fetching questions", "danger");
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const handleFormSelect = (formType) => {
    setSelectedForm(formType);
    fetchQuestions(formType.id);
    setShowModal(true);
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setNewQuestion({
      id: "",
      question: "",
      type: "text",
      options: [],
      required: true,
      correctAnswer: null
    });
    setShowAddQuestionModal(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setNewQuestion({
      id: question.id || "",
      question: question.question || "",
      type: question.type || "text",
      options: question.options || [],
      required: question.required !== undefined ? question.required : true,
      correctAnswer: question.correctAnswer || null
    });
    setShowAddQuestionModal(true);
  };

  const handleSaveQuestion = async () => {
    try {
      const formConfig = formTypes.find(ft => ft.id === selectedForm.id);

      if (formConfig && formConfig.jsonData) {
        // For JSON-based forms, use the JSON API
        if (editingQuestion) {
          await axios.put(`http://localhost:8000/api/json/updateFormQuestion/${selectedForm.id}/${editingQuestion.id}/`, newQuestion);
          showAlert("Question updated successfully in JSON file", "success");
        } else {
          await axios.post(`http://localhost:8000/api/json/addFormQuestion/${selectedForm.id}/`, newQuestion);
          showAlert("Question added successfully to JSON file", "success");
        }
        fetchQuestions(selectedForm.id);
      } else {
        // For forms without JSON data, show message
        showAlert("This form type doesn't support editing", "warning");
      }

      setShowAddQuestionModal(false);
    } catch (error) {
      console.error("Error saving question:", error);
      showAlert("Error saving question", "danger");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        const formConfig = formTypes.find(ft => ft.id === selectedForm.id);

        if (formConfig && formConfig.jsonData) {
          // For JSON-based forms, use the JSON API
          await axios.delete(`http://localhost:8000/api/json/deleteFormQuestion/${selectedForm.id}/${questionId}/`);
          showAlert("Question deleted successfully from JSON file", "success");
          fetchQuestions(selectedForm.id);
        } else {
          // For forms without JSON data, show message
          showAlert("This form type doesn't support editing", "warning");
        }
      } catch (error) {
        console.error("Error deleting question:", error);
        showAlert("Error deleting question", "danger");
      }
    }
  };

  const handleAddOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, ""]
    });
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = newQuestion.options.filter((_, i) => i !== index);
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions
    });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions
    });
  };

  const exportFormData = async (formType) => {
    try {
      const formConfig = formTypes.find(ft => ft.id === formType);

      if (formConfig && formConfig.jsonData) {
        // For JSON-based forms, export the current JSON structure
        const response = await axios.get(`http://localhost:8000/api/json/getFormQuestions/${formType}/`);
        const jsonData = { questions: response.data };
        const jsonString = JSON.stringify(jsonData, null, 2);
        downloadFile(jsonString, `${formType}Questions.json`, 'application/json');
        showAlert("Current JSON structure exported successfully", "success");
      } else {
        // For forms without JSON data, show message
        showAlert("This form type doesn't have exportable data", "warning");
      }
    } catch (error) {
      console.error("Error exporting form data:", error);
      showAlert("Error exporting form data", "danger");
    }
  };

  const downloadFile = (content, fileName, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div style={{ backgroundColor: "var(--light-gray)", minHeight: "100vh" }}>
      <Navbar />
      <div
        className="main-content"
        style={{
          marginLeft: "70px",
          padding: "20px",
          transition: "margin-left 0.3s ease"
        }}
      >
        <Container fluid>
          <h2 className="text-center mb-4" style={{ color: "var(--primary-dark-blue)" }}>Form Management</h2>

          {alert.show && (
            <Alert variant={alert.type} className="mb-4">
              {alert.message}
            </Alert>
          )}

          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading forms...</p>
            </div>
          ) : (
            <Row>
              {forms.length > 0 ? (
                forms.map((formType) => (
                  <Col md={6} lg={4} key={formType.id} className="mb-4">
                    <Card>
                      <Card.Body>
                        <Card.Title>{formType.name}</Card.Title>
                        <Card.Text>{formType.description}</Card.Text>
                        <div className="d-flex justify-content-between">
                          <Button
                            variant={formType.jsonData ? "primary" : "secondary"}
                            onClick={() => handleFormSelect(formType)}
                            className="me-2"
                            disabled={!formType.jsonData}
                          >
                            {formType.jsonData ? "Edit Form" : "Not Available"}
                          </Button>
                          <Button
                            variant="outline-success"
                            onClick={() => exportFormData(formType.id)}
                            disabled={!formType.jsonData}
                          >
                            {formType.jsonData ? "Export JSON" : "No Data"}
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                formTypes.map((formType) => (
                  <Col md={6} lg={4} key={formType.id} className="mb-4">
                    <Card>
                      <Card.Body>
                        <Card.Title>{formType.name}</Card.Title>
                        <Card.Text>{formType.description}</Card.Text>
                        <div className="d-flex justify-content-between">
                          <Button
                            variant={formType.jsonData ? "primary" : "secondary"}
                            onClick={() => handleFormSelect(formType)}
                            className="me-2"
                            disabled={!formType.jsonData}
                          >
                            {formType.jsonData ? "Edit Form" : "Not Available"}
                          </Button>
                          <Button
                            variant="outline-success"
                            onClick={() => exportFormData(formType.id)}
                            disabled={!formType.jsonData}
                          >
                            {formType.jsonData ? "Export JSON" : "No Data"}
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          )}

          {/* Form Editor Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>
                {selectedForm ? `Edit ${selectedForm.name}` : "Form Editor"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedForm && formTypes.find(ft => ft.id === selectedForm.id)?.jsonData ? (
                <Alert variant="success" className="mb-3">
                  <strong>Auto-Save Enabled:</strong> All changes to this form will be automatically saved to the JSON file.
                </Alert>
              ) : (
                <Alert variant="warning" className="mb-3">
                  <strong>Read-Only:</strong> This form type doesn't have JSON data configured and cannot be edited.
                </Alert>
              )}

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Questions</h5>
                <div>
                  <Button
                    variant="success"
                    onClick={handleAddQuestion}
                    className="me-2"
                    disabled={!selectedForm || !formTypes.find(ft => ft.id === selectedForm.id)?.jsonData}
                  >
                    Add Question
                  </Button>
                  {selectedForm && formTypes.find(ft => ft.id === selectedForm.id)?.jsonData && (
                    <Button variant="outline-info" onClick={() => exportFormData(selectedForm.id)}>
                      Export JSON
                    </Button>
                  )}
                </div>
              </div>

              {questions.length === 0 ? (
                <p className="text-muted">No questions added yet.</p>
              ) : (
                <div>
                  {questions.map((question, index) => (
                    <Card key={question.id || index} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h6>Question {index + 1} {question.id && `(ID: ${question.id})`}</h6>
                            <p><strong>{question.question}</strong></p>
                            <p className="text-muted">Type: {question.type || "text"}</p>
                            {question.options && question.options.length > 0 && (
                              <div>
                                <strong>Options:</strong>
                                <ul>
                                  {question.options.map((option, optIndex) => (
                                    <li key={optIndex} className={question.correctAnswer === optIndex ? "text-success fw-bold" : ""}>
                                      {option} {question.correctAnswer === optIndex && "(Correct Answer)"}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {question.correctAnswer !== null && question.correctAnswer !== undefined && (
                              <p className="text-muted">
                                Correct Answer: Option {question.correctAnswer + 1}
                              </p>
                            )}
                            <p className="text-muted">
                              Required: {question.required !== undefined ? (question.required ? "Yes" : "No") : "Yes"}
                            </p>
                          </div>
                          <div>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEditQuestion(question)}
                              className="me-2"
                              disabled={!selectedForm || !formTypes.find(ft => ft.id === selectedForm.id)?.jsonData}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteQuestion(question.id)}
                              disabled={!selectedForm || !formTypes.find(ft => ft.id === selectedForm.id)?.jsonData}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Add/Edit Question Modal */}
          <Modal show={showAddQuestionModal} onHide={() => setShowAddQuestionModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>
                {editingQuestion ? "Edit Question" : "Add Question"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Question ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={newQuestion.id}
                    onChange={(e) => setNewQuestion({ ...newQuestion, id: e.target.value })}
                    placeholder="Enter question ID (e.g., rq1, cq1, fq1)"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Question</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    placeholder="Enter question"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="number">Number</option>
                    <option value="select">Select</option>
                    <option value="radio">Radio</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="textarea">Textarea</option>
                  </Form.Select>
                </Form.Group>

                {(newQuestion.type === "select" || newQuestion.type === "radio" || newQuestion.type === "checkbox") && (
                  <Form.Group className="mb-3">
                    <Form.Label>Options</Form.Label>
                    {newQuestion.options.map((option, index) => (
                      <div key={index} className="d-flex mb-2">
                        <Form.Control
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="ms-2"
                          onClick={() => handleRemoveOption(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline-primary" size="sm" onClick={handleAddOption}>
                      Add Option
                    </Button>
                  </Form.Group>
                )}

                {newQuestion.options.length > 0 && (
                  <Form.Group className="mb-3">
                    <Form.Label>Correct Answer (for registration form)</Form.Label>
                    <Form.Select
                      value={newQuestion.correctAnswer !== null ? newQuestion.correctAnswer : ""}
                      onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value !== "" ? parseInt(e.target.value) : null })}
                    >
                      <option value="">No correct answer</option>
                      {newQuestion.options.map((option, index) => (
                        <option key={index} value={index}>
                          Option {index + 1}: {option}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Required"
                    checked={newQuestion.required}
                    onChange={(e) => setNewQuestion({ ...newQuestion, required: e.target.checked })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAddQuestionModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveQuestion}>
                {editingQuestion ? "Update" : "Add"} Question
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </div>
  );
};

export default FormManagement;
