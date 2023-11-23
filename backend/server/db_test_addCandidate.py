import json
from django.test import TestCase
from django.urls import reverse
from django.http import JsonResponse
from .models import Candidate

class AddCandidateTestCase(TestCase):

    def test_add_candidate_success(self):
        # Test the successful addition of a candidate
        data = {
            'id': 'candidate123',
            'name': 'Candidate Name',
            'email': 'candidate@example.com',
            'department': 'CS',
            'year': '3',
            'score': '90',
            'contact': '122334354',
            'imgSrc': '',
            'rq1': 0,
            'rq2': 1,
            'rq3': 2,
            'rq4': 3,
            'rq5': 4,
            'rq6': 5,
        }

        response = self.client.post(reverse('addCandidate'), json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'message': 'data added successfully'})

        # Check if the candidate is actually added to the database
        candidate = Candidate.objects.get(id='candidate123')
        self.assertEqual(candidate.name, 'Candidate Name')
        self.assertEqual(candidate.email, 'candidate@example.com')
        self.assertEqual(candidate.department, 'CS')
        self.assertEqual(candidate.year, '3')
        self.assertEqual(candidate.score, '12')
        self.assertEqual(candidate.status, 1)
        self.assertEqual(candidate.imgSrc, '')

    def test_add_candidate_invalid_method(self):
        # Test sending a GET request, which should result in an error
        response = self.client.get(reverse('addCandidate'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'message': 'Invalid request method'})
