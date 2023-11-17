import unittest
from unittest.mock import MagicMock
from django.http import HttpRequest, JsonResponse
from django.test import Client, TestCase
from .models import *
from .views import *

class AddMenteeTestCase(TestCase):
    client = Client()
    def test_add_mentee_success(self):
        # Test the successful addition of a mentee
        mentor = Candidate.objects.create(id='mentor123', email='mentor@example.com', name='Mentor Name', department='CS', status=3)
        data = {
            'id': 'mentee123',
            'name': 'Mentee Name',
            'email': 'mentee@example.com',
            'department': 'CS',
            'mentorId': mentor.id,
            'imgSrc': '',
        }

        response = self.client.post('http://127.0.0.1/addMentee/', json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'message': 'Mentee added successfully'})

        # Check if the mentee is actually added to the database
        mentee = Mentee.objects.get(id='mentee123')
        self.assertEqual(mentee.name, 'Mentee Name')
        self.assertEqual(mentee.email, 'mentee@example.com')
        self.assertEqual(mentee.department, 'CS')
        self.assertEqual(mentee.mentorId, mentor.id)
        self.assertEqual(mentee.imgSrc, '')

    def test_add_mentee_existing_mentee(self):
        # Test adding a mentee with an existing ID
        existing_mentee = Mentee.objects.create(id='existing_mentee', name='Existing Mentee', email='existing@example.com', department='CS')

        data = {
            'id': 'existing_mentee',
            'name': 'New Mentee',
            'email': 'new_mentee@example.com',
            'department': 'CS',
            'mentorId': 'mentor123',
        }

        response = self.client.post('http://127.0.0.1:8000/addMentee/', json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'message': 'Mentee with this ID'})

    def test_add_mentee_invalid_method(self):
        # Test sending a GET request, which should result in an error
        response = self.client.get('http://127.0.0.1:8000/addMentee/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'message': 'Invalid request method'})