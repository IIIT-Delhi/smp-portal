from django.urls import path
from . import auth_view
from . import mentor_views
from . import mentee_views
from . import meeting_views
from . import attendance_views
from . import mmpairs_views
from . import forms_views
from . import mail_views


urlpatterns = [
    # usrt authentication 
    path("getIdByEmail/",auth_view.get_id_by_email, name="getIdByEmail"),

    # mentor and mentee add function
    path('addMentor/', mentor_views.add_mentor, name='addMentor'),
    path('addMentee/', mentee_views.add_mentee, name='addMentee'),
    path('addCandidate/', mentor_views.add_candidate, name='addCandidate'),

    # mentor and mentee edit by id 
    path('editMentorById/', mentor_views.edit_mentor_by_id, name='editMentorById'),
    path('editMenteeById/', mentee_views.edit_mentee_by_id, name='editMenteeById'),

    #Mentor and mentee get all 
    path('getAllMentors/', mentor_views.get_all_mentors, name='getAllMentors'),
    path('getAllMentees/', mentee_views.get_all_mentees, name='getAllMentees'),

    #Mentor and mentee get by Id 
    path('getMentorById/', mentor_views.get_mentor_by_id, name='getMentorById'),
    path('getMenteeById/', mentee_views.get_mentee_by_id, name='getMenteeById'),
    
    #Mentor and mentee delete all 
    path('deleteAllMentors/', mentor_views.delete_all_mentors, name='deleteAllMentors'),
    path('deleteAllMentees/', mentee_views.delete_all_mentees, name='deleteAllMentees'),
    
    #Mentor and mentee delete by Id
    path('deleteMentorById/', mentor_views.delete_mentor_by_id, name='deleteMentorById'),
    path('deleteMenteeById/', mentee_views.delete_mentee_by_id, name='deleteMenteeById'),
    

    # add menteee in bulk 
    path('uploadCSV/', mentee_views.upload_CSV, name='uploadCSV'),


    # meetings apis
    path('addMeeting/', meeting_views.add_meeting, name='addMeeting'),
    path('editMeetingById/', meeting_views.edit_meeting_by_id, name='editMeetingById'),
    path('deleteMeetingById/', meeting_views.delete_meeting_by_id, name='deleteMeetingById'),
    path('getMeetings/', meeting_views.get_meetings, name='getMeetings'),

    # attendance apis
    path('getAttendance/', attendance_views.get_attendance, name='getAttendance'),
    path('updateAttendance/', attendance_views.update_attendance, name='updateAttendance'),
    
    # mentor mentee pairing
    path('createMentorMenteePair/', mmpairs_views.create_mentor_mentee_pairs, name='createMentorMenteePair'),

    #forms API
    path('submitConsentForm/', forms_views.submit_consent_form, name='submitConsentForm'),
    path('getFormResponse/', forms_views.get_form_response, name='getFormResponse'),
    path('getFormStatus/', forms_views.get_form_status, name='getFormStatus'),
    path('updateFormStatus/', forms_views.update_form_status, name='updateFormStatus'),
    path('menteeFilledFeedback/', forms_views.mentee_filled_feedback, name='menteeFilledFeedback'),
    path('sendConsentForm/', forms_views.send_consent_form, name='sendConsentForm'),

    # Mail APIs 
    path('getMailSubjectAndBody/', mail_views.get_mail_subject_and_body, name="getMailSubjectAndBody"),

]