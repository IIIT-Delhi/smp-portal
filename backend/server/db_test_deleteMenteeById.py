import json
from django.test import Client
import unittest

class TestDeleteMenteeById(unittest.TestCase):
    client = Client()
    # Returns a JSON response with a success message when a GET request is made and all Mentee objects are deleted from the database.
    def test_get_request_success_message(self):
        response = self.client.post('http://127.0.0.1/deleteMenteeById/', json.dumps({'id': 3}).encode('utf-8'), content_type='application/json')
        data = json.loads(response.content.decode('utf-8'))
    
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["message"], "deleted 1 database entries")
    # Returns a JSON response with an error message when a non-GET request is made.
    def test_non_get_request_error_message(self):
        response = self.client.get('http://127.0.0.1/deleteMenteeById/')#, json.dumps({'id': 4}).encode('utf-8'), content_type='application/json')
        data = json.loads(response.content.decode('utf-8'))
    
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["message"], "Invalid request method")