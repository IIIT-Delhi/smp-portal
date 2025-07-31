from django.test import TestCase
from django.urls import reverse
from django.http import JsonResponse
import json
from server.models import Attendance, Meetings, Mentee

class TestUpdateAttendance(TestCase):
    def setUp(self):
        # Set up test data
        self.mentee = Mentee.objects.create(
            id="mentee1",
            email="mentee@example.com",
            name="Mentee Name",
            department="Mentee Department",
            contact="Contact",
            imgSrc="Image Source",
            mentorId="mentor1"
        )

        self.meeting = Meetings.objects.create(
            title="Meeting Title",
            schedulerId="mentor1",
            date="2023-11-23",
            time="15:30",
            attendee=2,
            description="Meeting Description",
            mentorBranches=["Branch1"]
        )

    def test_update_attendance(self):
        # Mock a POST request to update attendance for a meeting
        data = {
            "meetingId": self.meeting.meetingId,
            "attendees": [
                {
                    "id": "mentee1",
                    "attendance": 1  # Attendee is present
                }
            ]
        }
        response = self.client.post(reverse('updateAttendance'), json.dumps(data), content_type='application/json')

        # Check if the response is successful (status code 200)
        self.assertEqual(response.status_code, 200)

        # Check if the attendance is updated successfully
        updated_attendance = Attendance.objects.filter(attendeeId="mentee1", meetingId=self.meeting.meetingId).first()
        self.assertIsNotNone(updated_attendance)

        # Check if the response message is as expected
        expected_message = {"message": "Attendance updated successfully"}
        self.assertEqual(response.json(), expected_message)

        # Mock another POST request to update attendance to 0 (absent)
        data_absent = {
            "meetingId": self.meeting.meetingId,
            "attendees": [
                {
                    "id": "mentee1",
                    "attendance": 0  # Attendee is absent
                }
            ]
        }
        response_absent = self.client.post(reverse('updateAttendance'), json.dumps(data_absent), content_type='application/json')

        # Check if the response is successful (status code 200)
        self.assertEqual(response_absent.status_code, 200)

        # Check if the attendance is updated to 0 (absent) successfully
        updated_attendance_absent = Attendance.objects.filter(attendeeId="mentee1", meetingId=self.meeting.meetingId).first()
        self.assertIsNone(updated_attendance_absent)

        # Check if the response message is as expected
        expected_message_absent = {"message": "Attendance updated successfully"}
        self.assertEqual(response_absent.json(), expected_message_absent)
    
    def test_update_attendance_invalid_method(self):
        # Test sending a GET request, which should result in an error
        response = self.client.get(reverse('updateAttendance'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'error': 'Invalid request method'})