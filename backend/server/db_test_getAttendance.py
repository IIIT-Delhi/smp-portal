from django.test import TestCase
from django.urls import reverse
from django.http import JsonResponse
import json
from datetime import datetime, timedelta
from server.models import Meetings, Candidate, Mentee, Attendance, Admin

class TestGetAttendance(TestCase):
    def setUp(self):
        # Set up test data
        self.admin = Admin.objects.create(
            id="admin1",
            email="admin@example.com",
            name="Admin Name",
            department="Admin Department",
            phone="1234567890",
            address="Admin Address",
            imgSrc="Admin Image Source"
        )

        self.mentor_candidate = Candidate.objects.create(
            id="mentor1",
            email="mentor@example.com",
            name="Mentor Name",
            department="Mentor Department",
            year="Year",
            status=5,
            contact="Contact",
            size="Size",
            score="Score",
            imgSrc="Image Source"
        )

        self.mentee = Mentee.objects.create(
            id="mentee1",
            email="mentee@example.com",
            name="Mentee Name",
            department="Mentee Department",
            contact="Contact",
            imgSrc="Image Source",
            mentorId="mentor1"
        )

        self.meeting_past = Meetings.objects.create(
            title="Past Meeting",
            schedulerId="mentor1",
            date=(datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d'),
            time="15:00",
            attendee=1,
            description="Past Meeting Description",
            mentorBranches=["Branch1"]
        )

        self.meeting_future = Meetings.objects.create(
            title="Future Meeting",
            schedulerId="mentor1",
            date=(datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d'),
            time="16:00",
            attendee=2,
            description="Future Meeting Description",
            mentorBranches=["Branch2"]
        )

        self.attendance_present = Attendance.objects.create(
            attendeeId="mentee1",
            meetingId=self.meeting_past.meetingId
        )

    def test_get_attendance(self):
        # Mock a POST request to get attendance for a meeting
        data = {
            "meetingId": self.meeting_past.meetingId
        }
        response = self.client.post(reverse('getAttendance'), json.dumps(data), content_type='application/json')

        # Check if the response is successful (status code 200)
        self.assertEqual(response.status_code, 200)

        # Parse the JSON response
        attendance_data = response.json()

        # Check if the response contains the correct attendance details
        expected_attendance = {
            'attendees': [
                {'id': 'mentee1', 
                 'name': 'Mentee Name', 
                 'email': 'mentee@example.com', 
                 'attendance': 1
                }
            ]
        }
        self.assertDictEqual(attendance_data, expected_attendance)
    
    def test_get_attendance_invalid_method(self):
        # Test sending a GET request, which should result in an error
        response = self.client.get(reverse('getAttendance'))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'error': 'Invalid request method'})