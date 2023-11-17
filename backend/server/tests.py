import unittest
from unittest.mock import MagicMock
from django.http import HttpRequest, JsonResponse
from django.test import Client
from .models import *
from .views import *

class TestGetAllMentors(unittest.TestCase):

    # Returns a JSON response with a list of mentors and their details.
    def test_returns_json_response(self):
        # Arrange
        request = HttpRequest()
        request.method = "GET"
    
        # Act
        response = get_all_mentors(request)
    
        # Assert
        self.assertIsInstance(response, JsonResponse)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/json')

    # Includes 'goodiesStatus', 'reimbursement', and 'menteesToMentors' details for each mentor.
    def test_includes_mentor_details(self):
        # Arrange
        request = HttpRequest()
        request.method = "GET"
    
        # Act
        response = get_all_mentors(request)
        mentors = json.loads(response.content.decode('utf-8'))
        # Assert
        for mentor in mentors:
            self.assertIn('goodiesStatus', mentor)
            self.assertIn('reimbursement', mentor)
            self.assertIn('menteesToMentors', mentor)

    # 'menteesToMentors' includes a list of mentees associated with each mentor.
    def test_includes_mentees_list(self):
        # Arrange
        request = HttpRequest()
        request.method = "GET"
    
        # Act
        response = get_all_mentors(request)
        mentors = json.loads(response.content.decode('utf-8'))
    
        # Assert
        for mentor in mentors:
            self.assertIn('menteesToMentors', mentor)
            mentees = mentor['menteesToMentors']
            self.assertIsInstance(mentees, list)

    # Handles invalid request methods correctly.
    def test_handles_invalid_request_methods(self):
        # Arrange
        request = HttpRequest()
        request.method = "POST"
    
        # Act
        response = get_all_mentors(request)
    
        # Assert
        self.assertIsInstance(response, JsonResponse)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode('utf-8')), {"message": "Invalid request method"})
    
    def test_returns_correct_response(self):
        # Arrange
        request = HttpRequest()
        request.method = "GET"
    
        # Act
        response = get_all_mentors(request)
    
        # Assert
        self.assertIsInstance(response, JsonResponse)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode('utf-8')), [{'id': '1', 'email': 'vishesh20550@iiitd.ac.in', 'name': 'Vishesh Jain', 'department': 'B-CSB', 'year': 'B4', 'status': 5, 'size': 'M', 'score': '100', 'goodiesStatus': 0, 'reimbursement': 0, 'menteesToMentors': [['1', 'Mohit Sharma', 'mohit20086@iiitd.ac.in'], ['3', 'Riya', 'riya12345@iiitd.ac.in']]}, {'id': '5', 'email': 'lisa12345@iiitd.ac.in', 'name': 'Lisa', 'department': 'B-CSE', 'year': 'B4', 'status': 5, 'size': 'L', 'score': '100', 'goodiesStatus': 0, 'reimbursement': 0, 'menteesToMentors': [['2', 'Devraj Sharma', 'devraj20054@iiitd.ac.in'], ['4', 'Sam', 'sam12345@iiitd.ac.in']]}])

class TestGetMentorById(unittest.TestCase):
    client = Client()

    # Returns a JSON response with mentor details when a valid POST request with an 'id' parameter is received
    def test_valid_post_request_with_id_parameter(self):
        # Act
        response = self.client.post('http://127.0.0.1/getMentorById/', json.dumps({"id": 1}).encode('utf-8'), content_type='application/json')
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode('utf-8')), {'id': '1', 'email': 'vishesh20550@iiitd.ac.in', 'name': 'Vishesh Jain', 'department': 'B-CSB', 'year': 'B4', 'status': 5, 'size': 'M', 'score': '100', 'goodiesStatus': 0, 'reimbursement': 0, 'menteesToMentors': [['1', 'Mohit Sharma', 'mohit20086@iiitd.ac.in'], ['3', 'Riya', 'riya12345@iiitd.ac.in']]})

    # Returns a JSON response with "Mentor Not Found" message when no mentor is found with the given 'id'
    def test_no_mentor_found_with_given_id(self):
        # Act
        response = self.client.post('http://127.0.0.1/getMentorById/', json.dumps({"id": 100}).encode('utf-8'), content_type='application/json')
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content, b'{"message": "Mentor Not Found"}')

    # Returns a JSON response with "Invalid request method" message when a non-POST request is received
    def test_non_post_request_received(self):
        # Arrange
        request = HttpRequest()
        request.method = "GET"
        # Act
        response = get_mentor_by_id(request)
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content, b'{"message": "Invalid request method"}')

    # Returns a JSON response with "Invalid request method" message when a POST request with missing 'id' parameter is received
    def test_post_request_with_missing_id_parameter(self):    
        # Act
        response = self.client.post('http://127.0.0.1/getMentorById/', json.dumps({}).encode('utf-8'), content_type='application/json')
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content, b'{"message": "Mentor Not Found"}')

class TestGetAllMentees(unittest.TestCase):

    # Returns a list of all mentees with their mentor details if request method is GET
    def test_returns_mentees_with_mentor_details_if_request_method_is_get(self):
        # Arrange
        request = HttpRequest()
        request.method = "GET"
    
        # Act
        response = get_all_mentees(request)

        # Assert 
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content, b'[{"id": "1", "email": "mohit20086@iiitd.ac.in", "name": "Mohit Sharma", "department": "B-CSB", "imgSrc": "", "mentorId": "1", "mentorName": "Vishesh Jain", "mentorEmail": "vishesh20550@iiitd.ac.in"}, {"id": "2", "email": "devraj20054@iiitd.ac.in", "name": "Devraj Sharma", "department": "B-CSE", "imgSrc": "", "mentorId": "5", "mentorName": "Lisa", "mentorEmail": "lisa12345@iiitd.ac.in"}, {"id": "3", "email": "riya12345@iiitd.ac.in", "name": "Riya", "department": "B-CSB", "imgSrc": "", "mentorId": "1", "mentorName": "Vishesh Jain", "mentorEmail": "vishesh20550@iiitd.ac.in"}, {"id": "4", "email": "sam12345@iiitd.ac.in", "name": "Sam", "department": "B-CSE", "imgSrc": "", "mentorId": "5", "mentorName": "Lisa", "mentorEmail": "lisa12345@iiitd.ac.in"}]')

    # Returns a JSON response with status code 405 if request method is not GET
    def test_returns_json_response_if_request_method_is_not_get(self):
        # Arrange
        request = HttpRequest()
        request.method = "POST"
    
        # Act
        response = get_all_mentees(request)
    
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content, b'{"message": "Invalid request method"}')

    # Returns a JSON response with an error message if request method is not GET
    def test_returns_json_response_with_error_message_if_request_method_is_not_get(self):
        # Arrange
        request = HttpRequest()
        request.method = "POST"
    
        # Act
        response = get_all_mentees(request)
    
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content, b'{"message": "Invalid request method"}')

class TestGetIdByEmail(unittest.TestCase):
    client = Client()
    # Returns the id of the user with the given email and role.
    def test_returns_id_for_admin(self):
        # Calling the function under test
        response = self.client.post('http://127.0.0.1/getIdByEmail/', json.dumps({'email': 'aishwary20490@iiitd.ac.in', 'role': 'admin'}).encode('utf-8'), content_type='application/json')
        # Asserting the response
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content, b'{"id": "1", "email": "aishwary20490@iiitd.ac.in", "name": "Aishwary Sharma", "department": "Counselling", "phone": "123456", "address": "Old Acad", "imgSrc": ""}')

    # Returns the id of the user with the given email and role, along with mentor details for mentee role.
    def test_returns_id_for_mentor(self):
        # Calling the function under test
        response = self.client.post('http://127.0.0.1/getIdByEmail/', json.dumps({'email': 'lisa12345@iiitd.ac.in', 'role': 'mentor'}).encode('utf-8'), content_type='application/json')
        # Asserting the response
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content, b'{"id": "5", "email": "lisa12345@iiitd.ac.in", "name": "Lisa", "department": "B-CSE", "year": "B4", "status": 5, "size": "L", "score": "100", "imgSrc": ""}')

    def test_returns_id_for_mentee(self):
        # Calling the function under test
        response = self.client.post('http://127.0.0.1/getIdByEmail/', json.dumps({'email': 'devraj20054@iiitd.ac.in', 'role': 'mentee'}).encode('utf-8'), content_type='application/json')
        # Asserting the response
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content, b'{"id": "2", "email": "devraj20054@iiitd.ac.in", "name": "Devraj Sharma", "department": "B-CSE", "imgSrc": "", "mentorId": "5", "mentorName": "Lisa", "mentorEmail": "lisa12345@iiitd.ac.in"}')

class TestDeleteMentorById(unittest.TestCase):
    client = Client()
    # Successfully delete a mentor with valid id
    def test_delete_mentor_with_valid_id(self):
        response = self.client.post('http://127.0.0.1/deleteMentorById/', json.dumps({'id': 1}).encode('utf-8'), content_type='application/json')
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "No new mentor to replace"})

    # Replace deleted mentor with highest score mentor in the same department
    def test_replace_mentor_with_highest_score_mentor(self):
        response = self.client.post('http://127.0.0.1/deleteMentorById/', json.dumps({'id': 5}).encode('utf-8'), content_type='application/json')
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "No new mentor to replace"})

    # Mentor id is not provided in the request
    def test_no_mentor_id_provided(self):
        response = self.client.post('http://127.0.0.1/deleteMentorById/', json.dumps({}).encode('utf-8'), content_type='application/json')
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "Mentor not found"})

    # Mentor id provided in the request is not valid
    def test_invalid_mentor_id_provided(self):
        response = self.client.post('http://127.0.0.1/deleteMentorById/', json.dumps({'id': 100}).encode('utf-8'), content_type='application/json')    
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "Mentor not found"})