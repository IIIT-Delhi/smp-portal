from django.test import TestCase
from django.urls import reverse
from django.http import JsonResponse
import json
from server.models import Meetings

class TestEditMeetingById(TestCase):
    def setUp(self):
        # Set up test data
        self.meeting = Meetings.objects.create(
            title="Meeting Title",
            schedulerId="1",
            date="2023-11-23",
            time="15:30:00",
            attendee=1,
            description="Meeting Description",
            mentorBranches=["Branch1", "Branch2"]
        )

    def test_edit_meeting_by_id(self):
        # Mock a POST request to edit the meeting
        data = {
            "meetingId": self.meeting.meetingId,
            "schedulerId": "2",
            "date": "2023-11-24",
            "time": "16:00:00",
            "attendee": ["Mentors", "Mentees"],
            "title": "Updated Meeting Title",
            "description": "Updated Meeting Description",
            "mentorBranches": ["Branch3", "Branch4"]
        }
        response = self.client.post(reverse('editMeetingById'), json.dumps(data), content_type='application/json')

        # Check if the response is successful (status code 200)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'message': 'data added successfully'})

        # Check if the meeting is edited successfully
        edited_meeting = Meetings.objects.get(meetingId=self.meeting.meetingId)
        self.assertEqual(edited_meeting.schedulerId, "2")
        self.assertEqual(edited_meeting.date, "2023-11-24")
        self.assertEqual(edited_meeting.time, "16:00:00")
        self.assertEqual(edited_meeting.attendee, 3)
        self.assertEqual(edited_meeting.title, "Updated Meeting Title")
        self.assertEqual(edited_meeting.description, "Updated Meeting Description")
        self.assertEqual(edited_meeting.mentorBranches, ["Branch3", "Branch4"])
    
    def test_edit_meeting_invalid_method(self):
        # Test sending a GET request, which should result in an error
        response = self.client.get(reverse('editMeetingById'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'message': 'Invalid request method'})