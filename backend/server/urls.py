from django.contrib import admin
from django.urls import path, include
import server.view as views

urlpatterns = [
    path('', views.index, name="home"),
    path("getIdByEmail/",views.get_id_by_email, name="getIdByEmail"),

    # mentor and mentee add function
    path('addMentor/', views.add_mentor, name='addMentor'),
    path('addMentee/', views.add_mentee, name='addMentee'),
    path('addCandidate/', views.add_candidate, name='addCandidate'),

    # mentor and mentee edit by id 
    path('editMentorById/', views.edit_mentor_by_id, name='editMentorById'),
    path('editMenteeById/', views.edit_mentee_by_id, name='editMenteeById'),

    #Mentor and mentee get all 
    path('getAllMentors/', views.get_all_mentors, name='getAllMentors'),
    path('getAllMentees/', views.get_all_mentees, name='getAllMentees'),

    #Mentor and mentee get by Id 
    path('getMentorById/', views.get_mentor_by_id, name='getMentorById'),
    path('getMenteeById/', views.get_mentee_by_id, name='getMenteeById'),
    
    #Mentor and mentee delete all 
    path('deleteAllMentors/', views.delete_all_mentors, name='deleteAllMentors'),
    path('deleteAllMentees/', views.delete_all_mentees, name='deleteAllMentees'),
    
    #Mentor and mentee delete by Id
    path('deleteMentorById/', views.delete_mentor_by_id, name='deleteMentorById'),
    path('deleteMenteeById/', views.delete_mentee_by_id, name='deleteMenteeById'),
    

    # add menteee in bulk 
    path('uploadCSV/', views.upload_CSV, name='uploadCSV'),


    # meetings apis
    path('addMeeting/', views.add_meeting, name='addMeeting'),
    path('editMeetingById/', views.edit_meeting_by_id, name='editMeetingById'),
    path('deleteMeetingById/', views.delete_meeting_by_id, name='deleteMeetingById'),
    path('getMeetings/', views.get_meetings, name='getMeetings'),

    # attendance apis
    path('getAttendance/', views.get_attendance, name='getAttendance'),
    path('updateAttendance/', views.update_attendance, name='updateAttendance'),
    
    # mentor mentee pairing
    path('createMentorMenteePair/', views.create_mentor_mentee_pairs, name='createMentorMenteePair'),

    #forms API
    path('submitConsentForm/', views.submit_consent_form, name='submitConsentForm'),
    path('getFormResponse/', views.get_form_response, name='getFormResponse'),
    path('getFormStatus/', views.get_form_status, name='getFormStatus'),
    path('updateFormStatus/', views.update_form_status, name='updateFormStatus'),
    path('menteeFilledFeedback/', views.mentee_filled_feedback, name='menteeFilledFeedback'),
    path('sendConsentForm/', views.send_consent_form, name='sendConsentForm'),
    path('getExcellenceAward/', views.get_excellence_award, name='getExcellenceAward'),
    path('updateExcellenceAward/', views.update_excellence_award, name='updateExcellenceAward'),

    # Mail APIs 
    path('getMailSubjectAndBody/', views.get_mail_subject_and_body, name="getMailSubjectAndBody"),

]

