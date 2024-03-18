from django.test import TestCase
from django.urls import reverse
from django.http import JsonResponse
import json
from server.models import Mentee, Candidate, Mentor

class TestCreateMentorMenteePair(TestCase):
    def setUp(self):
        # Set up test data
        self.mentee1 = Mentee.objects.create(
            id="mentee1",
            email="mentee1@example.com",
            name="Mentee 1",
            department="Department1",
            contact="Contact1",
            imgSrc="Image Source1",
            mentorId=""
        )

        self.mentee2 = Mentee.objects.create(
            id="mentee2",
            email="mentee2@example.com",
            name="Mentee 2",
            department="Department1",
            contact="Contact2",
            imgSrc="Image Source2",
            mentorId=""
        )

        self.candidate1 = Candidate.objects.create(
            id="candidate1",
            email="candidate1@example.com",
            name="Candidate 1",
            department="Department1",
            year="Year1",
            status=3,
            contact="Contact1",
            size="Size1",
            score="Score1",
            imgSrc="Image Source Candidate1"
        )

        self.candidate2 = Candidate.objects.create(
            id="candidate2",
            email="candidate2@example.com",
            name="Candidate 2",
            department="Department1",
            year="Year2",
            status=3,
            contact="Contact2",
            size="Size2",
            score="Score2",
            imgSrc="Image Source Candidate2"
        )

    def test_create_mentor_mentee_pairs(self):
        # Mock a POST request to create mentor-mentee pairs
        response = self.client.post(reverse('createMentorMenteePair'), content_type='application/json')

        # Check if the response is successful (status code 200)
        self.assertEqual(response.status_code, 200)

        # Check if mentor-mentee pairs are created successfully
        mentee1_updated = Mentee.objects.get(id="mentee1")
        mentee2_updated = Mentee.objects.get(id="mentee2")
        self.assertNotEqual(mentee1_updated.mentorId, "")
        self.assertNotEqual(mentee2_updated.mentorId, "")
        self.assertEqual(mentee1_updated.mentorId, mentee2_updated.mentorId)

        # Check if the response message is as expected
        expected_message = {"message": "Matching successful"}
        self.assertEqual(response.json(), expected_message)
    
    def test_create_mentor_mentee_pair_invalid_method(self):
        # Test sending a GET request, which should result in an error
        response = self.client.get(reverse('createMentorMenteePair'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'message': 'Invalid request method'})