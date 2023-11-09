from django.test import TestCase, Client
from django.urls import reverse
from .models import Mentor, Mentee, Candidate
import json

# Create your tests here.

class DeleteMentorByIdTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse('deleteMentorById')
        # Create test data
        # self.mentor = Candidate.objects.create(name='John Doe', id='1', status=3)
        # self.mentee = Mentee.objects.create(name='Jane Smith', mentor_id=self.mentor.id)
        # self.candidate = Candidate.objects.create(id='2', name='Alice', status=1, score=100)

    def test_delete_mentor_by_id_success(self):
        # Send a POST request with the mentor_id to delete
        response = self.client.post(self.url, json.dumps({'id': }))
        # Check if the mentor and related objects are deleted
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Deleted 1 database entries')

    def test_delete_mentor_by_id_invalid_request_method(self):
        # Send a GET request instead of POST
        response = self.client.get(self.url)
        # Check if the response is as expected
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Invalid request method')

    def test_delete_mentor_by_id_mentor_not_found(self):
        # Send a POST request with a non-existent mentor_id
        response = self.client.post(self.url, json.dumps({'id': 999}))
        # Check if the response is as expected
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Mentor not found')

    def test_delete_mentor_by_id_no_highest_score_mentor(self):
        # Set all candidates' status to -1 to simulate no highest score mentor
        # Candidate.objects.update(status=-1)
        # Send a POST request with the mentor_id to delete
        response = self.client.post(self.url, json.dumps({'id': }))
        # Check if the response is as expected
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'No Such Mentor Found')