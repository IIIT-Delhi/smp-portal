from django.test import TestCase
from django.urls import reverse
from django.http import JsonResponse
import json
from datetime import datetime, timedelta
from server.models import Meetings, Candidate, Mentee

class TestGetMeetings(TestCase):
    def setUp(self):
        # Set up test data
        self.mentor_candidate = Candidate.objects.create(
            id="1",
            email="mentor@example.com",
            name="Mentor Name",
            department="Department",
            year="Year",
            status=5,
            contact="Contact",
            size="Size",
            score="Score",
            imgSrc="Image Source"
        )

        self.mentee = Mentee.objects.create(
            id="2",
            email="mentee@example.com",
            name="Mentee Name",
            department="Department",
            contact="Contact",
            imgSrc="Image Source",
            mentorId="1"
        )

        self.meeting_past = Meetings.objects.create(
            title="Past Meeting",
            schedulerId="1",
            date=(datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d'),
            time="15:00",
            attendee=1,
            description="Past Meeting Description",
            mentorBranches=["Branch1"]
        )

        self.meeting_future = Meetings.objects.create(
            title="Future Meeting",
            schedulerId="1",
            date=(datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d'),
            time="16:00",
            attendee=1,
            description="Future Meeting Description",
            mentorBranches=["Branch2"]
        )

    def test_get_meetings(self):
        # Mock a POST request to get meetings for a mentor
        data = {
            "role": "mentor",
            "id": "1"
        }
        response = self.client.post(reverse('getMeetings'), json.dumps(data), content_type='application/json')

        # Check if the response is successful (status code 200)
        self.assertEqual(response.status_code, 200)

        # Parse the JSON response
        meetings_data = response.json()

        # Check if the meetings are categorized correctly
        self.assertIn('previousMeeting', meetings_data)
        self.assertIn('upcomingMeeting', meetings_data)
        self.assertEqual(len(meetings_data['previousMeeting']), 1)
        self.assertEqual(len(meetings_data['upcomingMeeting']), 1)

        # Check if the response contains the correct meeting details
        expected_past_meeting = {
            'meetingId': 1, 
            'schedulerId': '1', 
            'title': 'Past Meeting', 
            'date': '2023-11-23', 
            'time': '15:00', 
            'attendee': ['Mentors'], 
            'mentorBranches': ['Branch1'], 
            'description': 'Past Meeting Description'}
        self.assertDictEqual(meetings_data['previousMeeting'][0], expected_past_meeting)

        # Check if the response contains the correct upcoming meeting details
        expected_future_meeting = {
            'meetingId': 2, 
            'schedulerId': '1', 
            'title': 'Future Meeting', 
            'date': '2023-11-25', 
            'time': '16:00', 
            'attendee': ['Mentors'], 
            'mentorBranches': ['Branch2'], 
            'description': 'Future Meeting Description'}
        self.assertDictEqual(meetings_data['upcomingMeeting'][0], expected_future_meeting)
    
    def test_get_meetings_invalid_method(self):
        # Test sending a GET request, which should result in an error
        response = self.client.get(reverse('getMeetings'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'message': 'Invalid request method'})