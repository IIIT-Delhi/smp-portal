from django.contrib import admin
from django.urls import path, include
import server.view as views
from server.view import json_form_management_views as json_views

urlpatterns = [
    path('', views.index, name="home"),
    path('api/getIdByEmail/', views.get_id_by_email, name="getIdByEmail"),

    # mentor and mentee add function
    path('api/addMentor/', views.add_mentor, name='addMentor'),
    path('api/addMentee/', views.add_mentee, name='addMentee'),
    path('api/addCandidate/', views.add_candidate, name='addCandidate'),

    # mentor and mentee edit by id 
    path('api/editMentorById/', views.edit_mentor_by_id, name='editMentorById'),
    path('api/editMenteeById/', views.edit_mentee_by_id, name='editMenteeById'),

    # Mentor and mentee get all 
    path('api/getAllMentors/', views.get_all_mentors, name='getAllMentors'),
    path('api/getAllMentees/', views.get_all_mentees, name='getAllMentees'),
    path('api/getAllMtechMentees/', views.get_all_mtech_mentees, name='getAllMtechMentees'),
    path('api/getAllMtechMentors/', views.get_all_mtech_mentors, name='getAllMtechMentors'),


    # Mentor and mentee get by Id 
    path('api/getMentorById/', views.get_mentor_by_id, name='getMentorById'),
    path('api/getMenteeById/', views.get_mentee_by_id, name='getMenteeById'),
    
    # Mentor and mentee delete all 
    path('api/deleteAllMentors/', views.delete_all_mentors, name='deleteAllMentors'),
    path('api/deleteAllMentees/', views.delete_all_mentees, name='deleteAllMentees'),
    
    # Mentor and mentee delete by Id
    path('api/deleteMentorById/', views.delete_mentor_by_id, name='deleteMentorById'),
    path('api/deleteMenteeById/', views.delete_mentee_by_id, name='deleteMenteeById'),

    # Save Mentor Remarks
    path('api/<str:candidate_id>/saveMentorRemarks/', views.save_mentor_remarks, name='saveMentorRemarks'),

    # Get Mentor Remarks
    path('api/<str:candidate_id>/getMentorRemarks/', views.get_mentor_remarks, name='getMentorRemarks'),    

    # add menteee in bulk 
    path('api/uploadCSV/', views.upload_CSV, name='uploadCSV'),

    # meetings apis
    path('api/addMeeting/', views.add_meeting, name='addMeeting'),
    path('api/editMeetingById/', views.edit_meeting_by_id, name='editMeetingById'),
    path('api/deleteMeetingById/', views.delete_meeting_by_id, name='deleteMeetingById'),
    path('api/getMeetings/', views.get_meetings, name='getMeetings'),

    # attendance apis
    path('api/getAttendance/', views.get_attendance, name='getAttendance'),
    path('api/updateAttendance/', views.update_attendance, name='updateAttendance'),
    
    # mentor mentee pairing
    path('api/createMentorMenteePair/', views.create_mentor_mentee_pairs, name='createMentorMenteePair'),

    # forms API
    path('api/submitConsentForm/', views.submit_consent_form, name='submitConsentForm'),
    path('api/getFormResponse/', views.get_form_response, name='getFormResponse'),
    path('api/getFormStatus/', views.get_form_status, name='getFormStatus'),
    path('api/updateFormStatus/', views.update_form_status, name='updateFormStatus'),
    path('api/menteeFilledFeedback/', views.mentee_filled_feedback, name='menteeFilledFeedback'),
    path('api/sendConsentForm/', views.send_consent_form, name='sendConsentForm'),
    path('api/getExcellenceAward/', views.get_excellence_award, name='getExcellenceAward'),
    path('api/updateExcellenceAward/', views.update_excellence_award, name='updateExcellenceAward'),


    # JSON Form Management APIs
    path('api/json/getFormQuestions/<str:form_type>/', json_views.get_json_form_questions, name='getJsonFormQuestions'),
    path('api/json/updateFormQuestions/<str:form_type>/', json_views.update_json_form_questions, name='updateJsonFormQuestions'),
    path('api/json/addFormQuestion/<str:form_type>/', json_views.add_json_form_question, name='addJsonFormQuestion'),
    path('api/json/updateFormQuestion/<str:form_type>/<str:question_id>/', json_views.update_json_form_question, name='updateJsonFormQuestion'),
    path('api/json/deleteFormQuestion/<str:form_type>/<str:question_id>/', json_views.delete_json_form_question, name='deleteJsonFormQuestion'),

    # Mail APIs 
    path('api/getMailSubjectAndBody/', views.get_mail_subject_and_body, name="getMailSubjectAndBody"),
    path('api/updateMailContent/', views.update_mail_content, name="updateMailContent"),
]