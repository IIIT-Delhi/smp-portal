import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import Navbar from '../../../navbar/Navbar';

const FeedbackQuestionManager = () => {
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    question: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/json/getFormQuestions/feedback/');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      showAlert('Error fetching questions', 'danger');
    }
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.id || !formData.question) {
      showAlert('Please fill in all fields', 'danger');
      return;
    }

    try {
      if (editingQuestion) {
        // Update existing question
        await axios.put(
          `http://localhost:8000/api/json/updateFormQuestion/feedback/${editingQuestion.id}/`,
          formData
        );
        showAlert('Question updated successfully');
      } else {
        // Add new question
        await axios.post('http://localhost:8000/api/json/addFormQuestion/feedback/', formData);
        showAlert('Question added successfully');
      }
      
      setShowModal(false);
      setEditingQuestion(null);
      setFormData({ id: '', question: '' });
      fetchQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
      showAlert('Error saving question', 'danger');
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      id: question.id,
      question: question.question
    });
    setShowModal(true);
  };

  const handleDelete = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await axios.delete(`http://localhost:8000/api/json/deleteFormQuestion/feedback/${questionId}/`);
        showAlert('Question deleted successfully');
        fetchQuestions();
      } catch (error) {
        console.error('Error deleting question:', error);
        showAlert('Error deleting question', 'danger');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingQuestion(null);
    setFormData({ id: '', question: '' });
  };

  return (
    <div>
      <Navbar className="fixed-top" />
      <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Feedback Questions</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add New Question
        </Button>
      </div>

      {alert.show && (
        <Alert variant={alert.variant} dismissible onClose={() => setAlert({ show: false, message: '', variant: 'success' })}>
          {alert.message}
        </Alert>
      )}

      <div className="card">
        <div className="card-body">
          {questions.length === 0 ? (
            <p>No questions found. Add some questions to get started.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Question ID</th>
                    <th>Question Text</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question, index) => (
                    <tr key={index}>
                      <td>{question.id}</td>
                      <td>{question.question}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(question)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(question.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingQuestion ? 'Edit Question' : 'Add New Question'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Question ID</Form.Label>
              <Form.Control
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                placeholder="e.g., fq5"
                disabled={editingQuestion !== null}
                required
              />
              <Form.Text className="text-muted">
                Use format like 'fq1', 'fq2', etc. Cannot be changed after creation.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Question Text</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                placeholder="Enter the question text..."
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingQuestion ? 'Update Question' : 'Add Question'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      </div>
    </div>
  );
};

export default FeedbackQuestionManager;
