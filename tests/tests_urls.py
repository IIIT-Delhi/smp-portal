from django.test import TestCase
from django.urls import reverse, resolve
from server.view.auth_view import get_id_by_email
from server.view.attendance_views import get_attendance, update_attendance
from server.view.forms_views import get_form_response,get_form_status,update_form_status, submit_consent_form, mentee_filled_feedback, send_consent_form
from server.view.helper_functions import send_emails_to,send_emails_to_attendees, get_mail_content
from server.view.mail_views import get_mail_subject_and_body
from server.view.meeting_views import add_meeting,edit_meeting_by_id,delete_meeting_by_id,get_meetings
from server.view.mentee_views import add_mentee,upload_CSV,edit_mentee_by_id,get_all_mentees,get_mentee_by_id,delete_all_mentees,delete_mentee_by_id
from server.view.mentor_views import add_candidate,add_mentor,edit_mentor_by_id,get_all_mentors,get_mentor_by_id,delete_all_mentors,delete_mentor_by_id
from server.view.mmpairs_views import create_mentor_mentee_pairs
from server.view.views import index

class URLTests(TestCase):
    #attandance_views
    def test_attandance_views_get_attandance(self):
        url = reverse('getAttendance')
        self.assertEqual(resolve(url).func, get_attendance)
    
    def test_attandance_views_update_attandance(self):
        url = reverse('updateAttendance')
        self.assertEqual(resolve(url).func, update_attendance)
    
    #auth_views   
    def test_auth_views_get_id_by_email(self):
        url = reverse('getIdByEmail')
        self.assertEqual(resolve(url).func, get_id_by_email)
    
    #forms_view
    def test_forms_views_get_form_response(self):
        url = reverse('getFormResponse')
        self.assertEqual(resolve(url).func, get_form_response)
        
    def test_forms_views_get_form_status(self):
        url = reverse('getFormStatus')
        self.assertEqual(resolve(url).func, get_form_status)
    
    def test_forms_views_update_form_status(self):
        url = reverse('updateFormStatus')
        self.assertEqual(resolve(url).func, update_form_status)
        
    def test_forms_views_submit_consent_form(self):
        url = reverse('submitConsentForm')
        self.assertEqual(resolve(url).func, submit_consent_form)   
    
    def test_forms_views_mentee_filled_feedback(self):
        url = reverse('menteeFilledFeedback')
        self.assertEqual(resolve(url).func, mentee_filled_feedback)
    
    def test_forms_views_send_consent_form(self):
        url = reverse('sendConsentForm')
        self.assertEqual(resolve(url).func, send_consent_form)
        
    #mail_views
    def test_mail_views_get_mail_subject_and_body(self):
        url = reverse('getMailSubjectAndBody')
        self.assertEqual(resolve(url).func, get_mail_subject_and_body)
        
    #meeting_views
    def test_meeting_views_add_meeting(self):
        url = reverse('addMeeting')
        self.assertEqual(resolve(url).func, add_meeting)
        
    def test_meeting_views_edit_meeting_by_id(self):
        url = reverse('editMeetingById')
        self.assertEqual(resolve(url).func, edit_meeting_by_id)
    
    def test_meeting_views_delete_meeting_by_id(self):
        url = reverse('deleteMeetingById')
        self.assertEqual(resolve(url).func, delete_meeting_by_id)
    
    def test_meeting_views_get_meetings(self):
        url = reverse('getMeetings')
        self.assertEqual(resolve(url).func, get_meetings)
        
    #mentee_views
    def test_mentee_views_add_mentee(self):
        url = reverse('addMentee')
        self.assertEqual(resolve(url).func, add_mentee)
    
    def test_mentee_views_edit_mentee_by_id(self):
        url = reverse('editMenteeById')
        self.assertEqual(resolve(url).func, edit_mentee_by_id)
    
    def test_mentee_views_get_all_mentees(self):
        url = reverse('getAllMentees')
        self.assertEqual(resolve(url).func, get_all_mentees)
    
    def test_mentee_views_upload_CSV(self):
        url = reverse('uploadCSV')
        self.assertEqual(resolve(url).func, upload_CSV)
        
    def test_mentee_views_get_mentee_by_id(self):
        url = reverse('getMenteeById')
        self.assertEqual(resolve(url).func, get_mentee_by_id)
        
    def test_mentee_views_delete_all_mentees(self):
        url = reverse('deleteAllMentees')
        self.assertEqual(resolve(url).func, delete_all_mentees)
        
    def test_mentee_views_delete_mentee_by_id(self):
        url = reverse('deleteMenteeById')
        self.assertEqual(resolve(url).func, delete_mentee_by_id)
    
    #mentor_views
    def test_mentor_views_add_mentor(self):
        url = reverse('addMentor')
        self.assertEqual(resolve(url).func, add_mentor)
      
    def test_mentor_views_edit_mentor_by_id(self):
        url = reverse('editMentorById')
        self.assertEqual(resolve(url).func, edit_mentor_by_id)
      
    def test_mentor_views_add_candidate(self):
        url = reverse('addCandidate')
        self.assertEqual(resolve(url).func, add_candidate)
    
    def test_mentor_views_get_all_mentors(self):
        url = reverse('getAllMentors')
        self.assertEqual(resolve(url).func, get_all_mentors)
        
    def test_mentor_views_get_mentor_by_id(self):
        url = reverse('getMentorById')
        self.assertEqual(resolve(url).func, get_mentor_by_id)
        
    def test_mentor_views_delete_all_mentors(self):
        url = reverse('deleteAllMentors')
        self.assertEqual(resolve(url).func, delete_all_mentors)
        
    def test_mentor_views_delete_mentor_by_id(self):
        url = reverse('deleteMentorById')
        self.assertEqual(resolve(url).func, delete_mentor_by_id)
        
    #mmpairs_views
    def test_mmpairs_views_create_mentor_mentee_pairs(self):
        url = reverse('createMentorMenteePair')
        self.assertEqual(resolve(url).func, create_mentor_mentee_pairs)
        
    #views
    def test_views_index(self):
        url = reverse('home')
        self.assertEqual(resolve(url).func, index)
