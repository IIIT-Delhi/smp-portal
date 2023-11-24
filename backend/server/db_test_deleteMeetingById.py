from django.test import TestCase
from django.urls import reverse
from django.http import JsonResponse
import json
from server.models import Meetings

class TestDeleteMeetingById(TestCase):
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

    def test_delete_meeting_by_id(self):
        # Mock a POST request to delete the meeting
        data = {
            "meetingId": self.meeting.meetingId
        }
        response = self.client.post(reverse('deleteMeetingById'), json.dumps(data), content_type='application/json')

        # Check if the response is successful (status code 200)
        self.assertEqual(response.status_code, 200)

        # Check if the meeting is deleted successfully
        deleted_meeting = Meetings.objects.filter(meetingId=self.meeting.meetingId).first()
        self.assertIsNone(deleted_meeting)

        # Check if the response message is as expected
        expected_message = {"message": "deleted 1 database entries"}
        self.assertEqual(response.json(), expected_message)
    
    def test_delete_meeting_invalid_method(self):
        # Test sending a GET request, which should result in an error
        response = self.client.get(reverse('deleteMeetingById'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'message': 'Invalid request method'})