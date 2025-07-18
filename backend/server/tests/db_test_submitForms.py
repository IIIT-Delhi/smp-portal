from django.test import TestCase
from django.urls import reverse
from django.http import JsonResponse
import json
from server.models import Candidate, FormResponses

class TestSubmitForms(TestCase):
    def setUp(self):
        # Set up test data
        self.candidate = Candidate.objects.create(
            id="test_candidate",
            email="test@example.com",
            name="Test Candidate",
            department="Test Department",
            year="Test Year",
            status=1,
            contact="Test Contact",
            size="Test Size",
            score="Test Score",
            imgSrc="Test Image Source"
        )

    def test_submit_consent_form(self):
        # Mock a POST request to submit the consent form
        data = {
            "id": "test_candidate",
            "cq1": 1,
            "cq2": 0,
            # ... (include all cq responses)
            "cq11": 1,
            "imgSrc": "New Image Source",
            "size": "New Size"
        }
        response = self.client.post(reverse('submitConsentForm'), json.dumps(data), content_type='application/json')

        # Check if the response is successful (status code 200)
        self.assertEqual(response.status_code, 200)

        # Check if the consent form is submitted successfully
        candidate_updated = Candidate.objects.get(id="test_candidate")
        self.assertEqual(candidate_updated.imgSrc, "New Image Source")
        self.assertEqual(candidate_updated.size, "New Size")

        # Check if the response message is as expected
        expected_message = {"message": "Consent form submitted successfully"}
        self.assertEqual(response.json(), expected_message)

    def test_mentee_filled_feedback(self):
        # Mock a POST request to submit mentee feedback
        data = {
            "id": "test_candidate",
            "mentorId": "test_mentor",
            "mentorName": "Test Mentor",
            "fq1": "Feedback 1",
            "fq2": "Feedback 2",
            "fq3": "Feedback 3",
            "fq4": "Feedback 4"
        }
        response = self.client.post(reverse('menteeFilledFeedback'), json.dumps(data), content_type='application/json')

        # Check if the response is successful (status code 200)
        self.assertEqual(response.status_code, 200)

        # Check if mentee feedback is submitted successfully
        form_responses = FormResponses.objects.filter(submitterId="test_candidate", FormType='3').first()
        self.assertIsNotNone(form_responses)
        self.assertEqual(form_responses.responses["mentorId"], "test_mentor")

        # Check if the response message is as expected
        expected_message = {"message": "Feedback form submitted successfully"}
        self.assertEqual(response.json(), expected_message)