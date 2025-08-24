from django.test import TestCase
from django.urls import reverse
from django.http import JsonResponse
import json
from server.models import Meetings

class TestAddMeeting(TestCase):

    def test_add_meeting(self):
        # Mock a POST request
        data = {
            "schedulerId": "1",
            "date": "2023-11-23",
            "time": "15:30:00",
            "attendee": ["Mentors"],
            "title": "Meeting Title",
            "description": "Meeting Description",
            "mentorBranches": ["Branch1", "Branch2"],
            "menteeBranches": ["Branch1", "Branch2"],
            "menteeList": []
            
        }
        response = self.client.post(reverse('addMeeting'), json.dumps(data), content_type='application/json')

        # Check if the response is successful (status code 200)
        self.assertEqual(response.status_code, 200)

        # Check if the meeting is added successfully
        self.assertEqual(Meetings.objects.count(), 1)

        # Check if the response message is as expected
        expected_message = {"message": "Data added successfully"}
        self.assertEqual(response.json(), expected_message)

        meeting = Meetings.objects.get(schedulerId="1", date="2023-11-23", time="15:30:00")
        self.assertEqual(meeting.schedulerId, '1')
        self.assertEqual(meeting.date, '2023-11-23')
        self.assertEqual(meeting.time, '15:30:00')
        self.assertEqual(meeting.title, 'Meeting Title')
        self.assertEqual(meeting.description, 'Meeting Description')
        self.assertEqual(meeting.attendee, 1)
        # Attempt to add the same meeting again
        response_duplicate = self.client.post(reverse('addMeeting'), json.dumps(data), content_type='application/json')

        # Check if the response indicates a duplicate meeting
        expected_duplicate_error = {"error": "Meeting already scheduled at the same date and time"}
        self.assertEqual(response_duplicate.json(), expected_duplicate_error)
    
    def test_add_meeting_invalid_method(self):
        # Test sending a GET request, which should result in an error
        response = self.client.get(reverse('addMeeting'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'error': 'Invalid request method'})