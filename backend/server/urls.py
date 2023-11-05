from django.contrib import admin
from django.urls import path
from server import views

urlpatterns = [
    path('', views.index, name="home"),
    # path('try/', views.trying, name='try'),
    # get apis
    path('getAllAdmins/', views.get_all_admins, name='getAllAdmins'),
    path('getAdminById/', views.get_admin_by_id, name='getAdminById'),
    path('getAllMentors/', views.get_all_mentors, name='getAllMentors'),
    path('getMentorById/', views.get_mentor_by_id, name='getMentorById'),
    path('getAllMentees/', views.get_all_mentees, name='getAllMentees'),
    path('getMenteeById/', views.get_mentee_by_id, name='getMenteeById'),
    # delete apis
    path('deleteAllAdmins/', views.delete_all_admins, name='deleteAllAdmins'),
    path('deleteAdminById/', views.delete_admin_by_id, name='deleteAdminById'),
    path('deleteAllMentors/', views.delete_all_mentors, name='deleteAllMentors'),
    path('deleteMentorById/', views.delete_mentor_by_id, name='deleteMentorById'),
    path('deleteAllMentees/', views.delete_all_mentees, name='deleteAllMentees'),
    path('deleteMenteeById/', views.delete_mentee_by_id, name='deleteMenteeById'),
]