import json
from django.db import ProgrammingError
from django.db.utils import IntegrityError
from django.forms import ValidationError
from django.http import HttpRequest, JsonResponse
from django.test import TestCase, Client
from django.urls import reverse
from server.models import *
from server.view.views import *
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

    def test_add_candidate_missing_required_field(self):
        data = {
                'id': 'candidate123',
                'name': '',  # Setting name to an empty string to simulate missing required field
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

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'error': 'Name field is required'})
        
    def test_add_candidate_invalid_email_format(self):
        data = {
            'id': 'candidate123',
            'name': 'Candidate Name',
            'email': 'invalid_email_format',
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

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'error': 'Invalid email format'})

    def test_add_candidate_invalid_score(self):
        data = {
            'id': 'candidate123',
            'name': 'Candidate Name',
            'email': 'candidate@example.com',
            'department': 'CS',
            'year': '3',
            'score': 'invalid_score',
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

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'error': 'Invalid score format'})


class MenteeModelTestCase(TestCase):
    def setUp(self):
        # Create a sample Mentee object for testing
        self.mentee = Mentee.objects.create(
            id='1',
            email='test@example.com',
            name='Test Mentee',
            department='IT',
            contact='1234567890',
            imgSrc='test_image.png',
            mentorId='mentor123'
        )

    def test_mentee_creation(self):
        """Test if Mentee object is created correctly"""
        self.assertEqual(self.mentee.id, '1')
        self.assertEqual(self.mentee.email, 'test@example.com')
        self.assertEqual(self.mentee.name, 'Test Mentee')
        self.assertEqual(self.mentee.department, 'IT')
        self.assertEqual(self.mentee.contact, '1234567890')
        self.assertEqual(self.mentee.imgSrc, 'test_image.png')
        self.assertEqual(self.mentee.mentorId, 'mentor123')

    def test_mentee_str_method(self):
        """Test the __str__ method of Mentee model"""
        self.assertEqual(str(self.mentee), '1')
        
    def test_valid_mentee_creation(self):
        """Test if Mentee object is created correctly with valid data"""
        mentee = Mentee.objects.create(
            id='101',
            email='test@example.com',
            name='Test Mentee',
            department='IT',
            contact='1234567890',
            imgSrc='test_image.png',
            mentorId='mentor123'
        )
        self.assertEqual(mentee.id, '101')
        self.assertEqual(mentee.email, 'test@example.com')
        self.assertEqual(mentee.name, 'Test Mentee')
        self.assertEqual(mentee.department, 'IT')
        self.assertEqual(mentee.contact, '1234567890')
        self.assertEqual(mentee.imgSrc, 'test_image.png')
        self.assertEqual(mentee.mentorId, 'mentor123')

    def test_missing_required_field(self):
        """Test if ValidationError is raised when a required field is missing"""
        with self.assertRaises(ValidationError):
            Mentee.objects.create(
                id='2',
                email='test@example.com',
                department='IT',
                contact='1234567890',
                imgSrc='test_image.png',
                mentorId='mentor123'
            )

    def test_invalid_data_type(self):
        """Test if IntegrityError is raised when invalid data type is provided"""
        with self.assertRaises(IntegrityError):
            Mentee.objects.create(
                id=2,  # Integer instead of CharField
                email='test@example.com',
                name='Test Mentee',
                department='IT',
                contact='1234567890',
                imgSrc='test_image.png',
                mentorId='mentor123'
            )

    def test_unique_constraint_violation(self):
        """Test if IntegrityError is raised when unique constraint is violated"""
        # Creating a mentee with same ID as existing one
        Mentee.objects.create(
            id='1011',
            email='another_test@example.com',
            name='Another Test Mentee',
            department='IT',
            contact='1234567890',
            imgSrc='another_test_image.png',
            mentorId='mentor456'
        )
        # Attempting to create another mentee with the same ID
        with self.assertRaises(IntegrityError):
            Mentee.objects.create(
                id='1011',
                email='test@example.com',
                name='Test Mentee',
                department='IT',
                contact='1234567890',
                imgSrc='test_image.png',
                mentorId='mentor123'
            )

class AdminModelTestCase(TestCase):

    def test_create_admin(self):
        """Test creating a valid Admin instance"""
        admin = Admin.objects.create(
            id='admin123',
            email='admin@example.com',
            name='Admin User',
            department='IT',
            phone='1234567890',
            address='123 Street, City',
            imgSrc='admin_image.png'
        )
        self.assertEqual(admin.id, 'admin123')
        self.assertEqual(admin.email, 'admin@example.com')
        self.assertEqual(admin.name, 'Admin User')
        self.assertEqual(admin.department, 'IT')
        self.assertEqual(admin.phone, '1234567890')
        self.assertEqual(admin.address, '123 Street, City')
        self.assertEqual(admin.imgSrc, 'admin_image.png')
        

    def test_required_fields(self):
        """Test if IntegrityError is raised when required fields are missing"""
        with self.assertRaises(IntegrityError):
            Admin.objects.create()  # Missing all required fields

    def test_unique_constraint_violation(self):
        """Test if IntegrityError is raised when unique constraint is violated"""
        # Creating an admin with same ID as existing one
        Admin.objects.create(
            id='admin456',
            email='another_admin@example.com',
            name='Another Admin',
            department='HR',
            phone='1234567890',
            address='456 Street, City',
            imgSrc='another_admin_image.png'
        )
        # Attempting to create another admin with the same ID
        with self.assertRaises(IntegrityError):
            Admin.objects.create(
                id='admin456',
                email='test@example.com',
                name='Test Admin',
                department='Finance',
                phone='1234567890',
                address='789 Street, City',
                imgSrc='test_admin_image.png'
            )

    def test_invalid_email(self):
        """Test if ValidationError is raised for invalid email format"""
        with self.assertRaises(ValidationError):
            Admin.objects.create(
                id='admin789',
                email='invalid_email',  # Invalid email format
                name='Invalid Email Admin',
                department='Sales',
                phone='1234567890',
                address='789 Street, City',
                imgSrc='invalid_email_image.png'
            )
            
class MeetingsModelTestCase(TestCase):
    def setUp(self):
        self.meeting1 = Meetings.objects.create(
            schedulerId='1',
            title='Meeting 1',
            date='2024-04-08',
            time='10:00 AM',
            attendee=5,
            mentorBranches=['Branch A', 'Branch B'],
            menteeBranches=['Branch C', 'Branch D'],
            menteeList=['John Doe', 'Jane Doe'],
            description='This is the description for Meeting 1'
        )
        self.meeting2 = Meetings.objects.create(
            schedulerId='2',
            title='Meeting 2',
            date='2024-04-09',
            time='11:00 AM',
            attendee=3,
            mentorBranches=['Branch X', 'Branch Y'],
            menteeBranches=['Branch Z'],
            menteeList=['Alice', 'Bob'],
            description='This is the description for Meeting 2'
        )

    def test_meetings_created(self):
        """Test if meetings are created properly."""
        self.assertEqual(Meetings.objects.count(), 2)

    def test_meeting_str(self):
        """Test the __str__ method of the Meetings model."""
        self.assertEqual(str(self.meeting1), str(self.meeting1.meetingId))

    def test_meeting_attributes(self):
        """Test the attributes of the created meetings."""
        meeting1 = Meetings.objects.get(title='Meeting 1')
        meeting2 = Meetings.objects.get(title='Meeting 2')
        self.assertEqual(meeting1.schedulerId, '1')
        self.assertEqual(meeting1.attendee, 5)
        self.assertListEqual(meeting1.mentorBranches, ['Branch A', 'Branch B'])
        self.assertListEqual(meeting2.menteeList, ['Alice', 'Bob'])
    
    def test_unique_schedulerId(self):
        """Test if schedulerId is unique."""
        with self.assertRaises(IntegrityError):
            Meetings.objects.create(
                schedulerId='1',
                title='Meeting 2',
                date='2024-04-09',
                time='11:00 AM',
                attendee=3,
                mentorBranches=['Branch X', 'Branch Y'],
                menteeBranches=['Branch Z'],
                menteeList=['Alice', 'Bob'],
                description='This is the description for Meeting 2'
            )

    def test_invalid_attendee(self):
        """Test invalid attendee value."""
        with self.assertRaises(ValueError):
            Meetings.objects.create(
                schedulerId='2',
                title='Meeting 2',
                date='2024-04-09',
                time='11:00 AM',
                attendee=-3,  # Negative value not allowed
                mentorBranches=['Branch X', 'Branch Y'],
                menteeBranches=['Branch Z'],
                menteeList=['Alice', 'Bob'],
                description='This is the description for Meeting 2'
            )

    def test_invalid_date_format(self):
        """Test invalid date format."""
        with self.assertRaises(ValueError):
            Meetings.objects.create(
                schedulerId='2',
                title='Meeting 2',
                date='2024/04/09',  # Invalid date format
                time='11:00 AM',
                attendee=3,
                mentorBranches=['Branch X', 'Branch Y'],
                menteeBranches=['Branch Z'],
                menteeList=['Alice', 'Bob'],
                description='This is the description for Meeting 2'
            )

    def test_invalid_mentor_branches(self):
        """Test invalid mentor branches format."""
        with self.assertRaises(TypeError):
            Meetings.objects.create(
                schedulerId='2',
                title='Meeting 2',
                date='2024-04-09',
                time='11:00 AM',
                attendee=3,
                mentorBranches='Branch X',  # Invalid format
                menteeBranches=['Branch Z'],
                menteeList=['Alice', 'Bob'],
                description='This is the description for Meeting 2'
            )

    def test_blank_title(self):
        """Test blank title."""
        with self.assertRaises(IntegrityError):
            Meetings.objects.create(
                schedulerId='2',
                title='',  # Blank title not allowed
                date='2024-04-09',
                time='11:00 AM',
                attendee=3,
                mentorBranches=['Branch X', 'Branch Y'],
                menteeBranches=['Branch Z'],
                menteeList=['Alice', 'Bob'],
                description='This is the description for Meeting 2'
            )
    
    def test_blank_description(self):
        """Test blank description."""
        meeting = Meetings.objects.create(
            schedulerId='2',
            title='Meeting 2',
            date='2024-04-09',
            time='11:00 AM',
            attendee=3,
            mentorBranches=['Branch X', 'Branch Y'],
            menteeBranches=['Branch Z'],
            menteeList=['Alice', 'Bob'],
            description=''  # Blank description allowed
        )
        self.assertEqual(meeting.description, '')

    def test_invalid_time_format(self):
        """Test invalid time format."""
        with self.assertRaises(ValueError):
            Meetings.objects.create(
                schedulerId='2',
                title='Meeting 2',
                date='2024-04-09',
                time='25:00',  # Invalid time format
                attendee=3,
                mentorBranches=['Branch X', 'Branch Y'],
                menteeBranches=['Branch Z'],
                menteeList=['Alice', 'Bob'],
                description='This is the description for Meeting 2'
            )

class AttendanceModelTestCase(TestCase):
    def setUp(self):
        self.attendance1 = Attendance.objects.create(
            attendeeId='1',
            meetingId=[1, 2, 3]
        )

    def test_attendance_created(self):
        """Test if attendance is created properly."""
        self.assertEqual(Attendance.objects.count(), 1)

    # def test_attendance_str(self):
    #     """Test the __str__ method of the Attendance model."""
    #     self.assertEqual(str(self.attendance1), str(self.attendance1.id))

    def test_invalid_attendee_id(self):
        """Test invalid attendeeId value."""
        with self.assertRaises(IntegrityError):
            Attendance.objects.create(
                attendeeId=None,  # None value not allowed
                meetingId=[1, 2, 3]
            )

    def test_null_meeting_id(self):
        """Test null meetingId."""
        attendance = Attendance.objects.create(
            attendeeId='2',
            meetingId=None  # Null value allowed
        )
        self.assertIsNone(attendance.meetingId)

    def test_invalid_meeting_id_format(self):
        """Test invalid meetingId format."""
        with self.assertRaises(TypeError):
            Attendance.objects.create(
                attendeeId='3',
                meetingId='1234'  # Invalid format
            )


    def test_empty_meeting_id(self):
        """Test empty list for meetingId."""
        att = Attendance.objects.create(
                attendeeId='2',
                meetingId=[]  # Empty list allowed
            )
        self.assertEqual(att.meetingId,[])

    def test_invalid_meeting_id_type(self):
        """Test invalid type for meetingId."""
        with self.assertRaises(TypeError):
            Attendance.objects.create(
                attendeeId='3',
                meetingId='1,2,3'  # Should be a list
            )

    def test_invalid_attendee_id_format(self):
        """Test invalid format for attendeeId."""
        with self.assertRaises(ValueError):
            Attendance.objects.create(
                attendeeId='invalid_id_123',
                meetingId=[1, 2, 3]
            )

class FormResponsesModelTestCase(TestCase):
    def setUp(self):
        self.response1 = FormResponses.objects.create(
            submitterId='1',
            FormType='1',  # mentor enrollment
            responses={'name': 'John Doe', 'email': 'john@example.com'}
        )

    def test_response_created(self):
        """Test if response is created properly."""
        self.assertEqual(FormResponses.objects.count(), 1)

    def test_response_str(self):
        """Test the __str__ method of the FormResponses model."""
        self.assertEqual(str(self.response1), str(self.response1.SubmissionId))

    def test_invalid_form_type(self):
        """Test invalid FormType value."""
        with self.assertRaises(ValidationError):
            FormResponses.objects.create(
                submitterId='2',
                FormType='5',  # Invalid FormType
                responses={'name': 'Alice', 'email': 'alice@example.com'}
            )

    def test_null_responses(self):
        """Test null responses."""
        response = FormResponses.objects.create(
            submitterId='3',
            FormType='2',  # mentor consent
            responses=None  # Null value allowed
        )
        self.assertIsNone(response.responses)

    def test_invalid_responses_type(self):
        """Test invalid type for responses."""
        with self.assertRaises(TypeError):
            FormResponses.objects.create(
                submitterId='4',
                FormType='3',  # mentee feedback
                responses='Not a dictionary'  # Invalid type
            )

    def test_blank_submitter_id(self):
        """Test blank submitterId."""
        with self.assertRaises(ValidationError):
            FormResponses.objects.create(
                submitterId='',  # Blank submitterId not allowed
                FormType='1',
                responses={'name': 'Bob', 'email': 'bob@example.com'}
            )

    def test_empty_responses(self):
        """Test empty responses."""
        with self.assertRaises(ValidationError):
            FormResponses.objects.create(
                submitterId='5',
                FormType='2',
                responses={}  # Empty responses not allowed
            )

    def test_invalid_response_format(self):
        """Test invalid format for responses."""
        with self.assertRaises(ValueError):
            FormResponses.objects.create(
                submitterId='6',
                FormType='3',
                responses='{"name": "Charlie", "email": "charlie@example.com"}'  # Should be a dictionary
            )

    def test_null_submitter_id(self):
        """Test null submitterId."""
        with self.assertRaises(IntegrityError):
            FormResponses.objects.create(
                submitterId=None,  # Null submitterId not allowed
                FormType='1',
                responses={'name': 'David', 'email': 'david@example.com'}
            )
            
class FormStatusModelTestCase(TestCase):
    def setUp(self):
        self.form_status1 = FormStatus.objects.create(
            formId='1',
            formStatus='1'  # Status: on
        )

    def test_form_status_created(self):
        """Test if form status is created properly."""
        self.assertEqual(FormStatus.objects.count(), 1)

    def test_form_status_str(self):
        """Test the __str__ method of the FormStatus model."""
        self.assertEqual(str(self.form_status1), self.form_status1.formId)

    def test_invalid_form_status(self):
        """Test invalid formStatus value."""
        with self.assertRaises(IntegrityError):
            FormStatus.objects.create(
                formId='2',
                formStatus='2'  # Invalid formStatus
            )

    def test_blank_form_id(self):
        """Test blank formId."""
        with self.assertRaises(IntegrityError):
            FormStatus.objects.create(
                formId='',  # Blank formId not allowed
                formStatus='1'
            )

    def test_invalid_status_value(self):
        """Test invalid status value."""
        with self.assertRaises(ValueError):
            FormStatus.objects.create(
                formId='3',
                formStatus='3'  # Invalid status
            )

class ExcellenceAwardModelTestCase(TestCase):
    def setUp(self):
        self.excellence_award1 = ExcellenceAward.objects.create(
            candidateId='123'
        )

    def test_excellence_award_created(self):
        """Test if excellence award is created properly."""
        self.assertEqual(ExcellenceAward.objects.count(), 1)

    def test_excellence_award_str(self):
        self.assertEqual(self.excellence_award1.candidateId, '123')

    def test_blank_candidate_id(self):
        """Test blank candidateId."""
        with self.assertRaises(IntegrityError):
            ExcellenceAward.objects.create(
                candidateId=''  # Blank candidateId not allowed
            )

    def test_null_candidate_id(self):
        """Test null candidateId."""
        with self.assertRaises(IntegrityError):
            ExcellenceAward.objects.create(
                candidateId=None  # Null candidateId not allowed
            )

