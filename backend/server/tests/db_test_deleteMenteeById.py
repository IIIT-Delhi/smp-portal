from django.test import TestCase
from django.urls import reverse
from django.http import JsonResponse
import json
from server.models import Mentee, Candidate

class TestDeleteMenteeById(TestCase):
    def setUp(self):
        # Set up test data
        self.mentor = Candidate.objects.create(id='mentor123', email='mentor@example.com', name='Mentor Name', department='CS', status=5)
        self.mentee = Mentee.objects.create(
            id = 'mentee123',
            name = 'Mentee Name',
            email = 'mentee@example.com',
            department = 'CS',
            mentorId = self.mentor.id,
            imgSrc = '',
        )

    # Returns a JSON response with a success message when a GET request is made and all Mentee objects are deleted from the database.
    def test_get_request_success_message(self):
        response = self.client.post(reverse('deleteMenteeById'), json.dumps({'id': 'mentee123'}).encode('utf-8'), content_type='application/json')
        data = json.loads(response.content.decode('utf-8'))
    
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["message"], "deleted 1 database entries")
    # Returns a JSON response with an error message when a non-GET request is made.
    def test_non_get_request_error_message(self):
        response = self.client.get(reverse('deleteMenteeById'))#, json.dumps({'id': 4}).encode('utf-8'), content_type='application/json')
        data = json.loads(response.content.decode('utf-8'))
    
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["message"], "Invalid request method")