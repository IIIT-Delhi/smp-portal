from django.test import TestCase
from django.urls import reverse
from django.http import JsonResponse
import json
from server.models import Candidate, Mentee, Mentor, FormResponses, FormStatus

class TestFormStatus(TestCase):
    def setUp(self):
        # Set up test data
        self.candidate = Candidate.objects.create(
            id = 'test_mentor',
            name = 'Candidate Name',
            email = 'candidate@example.com',
            department = 'CS',
            year = '3',
            score = '90',
            contact = '122334354',
            imgSrc = '',
            status = 5,
        )
        self.mentor = Mentor.objects.create(
            id="test_mentor",
            goodiesStatus=0
        )

        self.mentee = Mentee.objects.create(
            id="test_mentee",
            email="test@example.com",
            name="Test Mentee",
            department="Test Department",
            contact="Test Contact",
            imgSrc="Test Image Source",
            mentorId="test_mentor"
        )

        self.form_responses = FormResponses.objects.create(
            submitterId="test_mentor",
            FormType='1',
            responses={"response1": "value1", "response2": "value2"}
        )

        self.form_status = FormStatus.objects.create(
            formId="1",
            formStatus="1"
        )

    def test_get_form_response(self):
        # Mock a POST request to get form responses
        data = {
            "formType": "1"
        }
        response = self.client.post(reverse('getFormResponse'), json.dumps(data), content_type='application/json')

        # Check if the response is successful (status code 200)
        self.assertEqual(response.status_code, 200)

        # Check if the form responses are retrieved successfully
        form_responses_data = response.json().get("formResponses", [])
        self.assertTrue(form_responses_data)
        self.assertEqual(form_responses_data[0]["submitterId"], "test_mentor")

    def test_get_form_status(self):
        # Mock a POST request to get form status
        response = self.client.post(reverse('getFormStatus'))

        # Check if the response is successful (status code 200)
        self.assertEqual(response.status_code, 200)

        # Check if the form status is retrieved successfully
        form_status_data = response.json()
        self.assertTrue(form_status_data)

    def test_update_form_status(self):
        # Mock a POST request to update form status
        data = {
            "formId": "1",
            "formStatus": "0"
        }
        response = self.client.post(reverse('updateFormStatus'), json.dumps(data), content_type='application/json')

        # Check if the response is successful (status code 200)
        self.assertEqual(response.status_code, 200)

        # Check if the form status is updated successfully
        form_status_updated = FormStatus.objects.get(formId="1")
        self.assertEqual(form_status_updated.formStatus, "0")