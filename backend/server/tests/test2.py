from django.http import HttpRequest, JsonResponse
from django.test import TestCase, Client
from django.urls import reverse
from .models import *
from .view.views import *
from datetime import datetime, timedelta
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
            "mentorBranches": ["Branch1", "Branch2"]
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

class AddMenteeTestCase(TestCase):
    client = Client()
    def test_add_mentee_success(self):
        # Test the successful addition of a mentee
        mentor = Candidate.objects.create(id='mentor123', email='mentor@example.com', name='Mentor Name', department='CS', status=5)
        data = {
            'id': 'mentee123',
            'name': 'Mentee Name',
            'email': 'mentee@example.com',
            'department': 'CS',
            'mentorId': mentor.id,
            'imgSrc': '',
        }

        response = self.client.post('http://127.0.0.1/addMentee/', json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'message': 'Mentee added successfully'})

        # Check if the mentee is actually added to the database
        mentee = Mentee.objects.get(id='mentee123')
        self.assertEqual(mentee.name, 'Mentee Name')
        self.assertEqual(mentee.email, 'mentee@example.com')
        self.assertEqual(mentee.department, 'CS')
        self.assertEqual(mentee.mentorId, mentor.id)
        self.assertEqual(mentee.imgSrc, '')

    def test_add_mentee_existing_mentee(self):
        # Test adding a mentee with an existing ID
        existing_mentee = Mentee.objects.create(id='existing_mentee', name='Existing Mentee', email='existing@example.com', department='CS')

        data = {
            'id': 'existing_mentee',
            'name': 'New Mentee',
            'email': 'new_mentee@example.com',
            'department': 'CS',
            'mentorId': 'mentor123',
        }

        response = self.client.post('http://127.0.0.1:8000/addMentee/', json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'message': 'Mentee with this ID already exist'})

    def test_add_mentee_invalid_method(self):
        # Test sending a GET request, which should result in an error
        response = self.client.get('http://127.0.0.1:8000/addMentee/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'message': 'Invalid request method'})

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

class TestDeleteMenteeById(TestCase):
    def setUp(self):
        # Set up test data
        self.mentor = Candidate.objects.create(id='mentor123', email='mentor@example.com', name='Mentor Name', department='CS', status=5)
        self.mentee = Mentee.objects.create(
            id = 'mentee123',
            name = 'Mentee Name',
            email = 'mentee@example.com',
            department = 'CS',
            mentorId = self.mentor.id,
            imgSrc = '',
        )

    # Returns a JSON response with a success message when a GET request is made and all Mentee objects are deleted from the database.
    def test_get_request_success_message(self):
        response = self.client.post(reverse('deleteMenteeById'), json.dumps({'id': 'mentee123'}).encode('utf-8'), content_type='application/json')
        data = json.loads(response.content.decode('utf-8'))
    
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["message"], "deleted 1 database entries")
    # Returns a JSON response with an error message when a non-GET request is made.
    def test_non_get_request_error_message(self):
        response = self.client.get(reverse('deleteMenteeById'))#, json.dumps({'id': 4}).encode('utf-8'), content_type='application/json')
        data = json.loads(response.content.decode('utf-8'))
    
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["message"], "Invalid request method")

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

        self.assertEqual(response.json(), {'message': 'Form status updated successfully'})

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
            'meetingId': 10, 
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
            'meetingId': 11, 
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