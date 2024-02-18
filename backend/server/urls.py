from django.contrib import admin
from django.urls import path, include
from server import views

urlpatterns = [
    path('', views.index, name="home"),
     path('', include('views.urls')),
    # path('try/', views.trying, name='try'),
    # get apis
    path('getAllAdmins/', views.get_all_admins, name='getAllAdmins'),
    path('getAdminById/', views.get_admin_by_id, name='getAdminById'),
    path('getAllMentors/', views.get_all_mentors, name='getAllMentors'),
    path('getMentorById/', views.get_mentor_by_id, name='getMentorById'),
    path('getAllMentees/', views.get_all_mentees, name='getAllMentees'),
    path('getMenteeById/', views.get_mentee_by_id, name='getMenteeById'),
    path("getIdByEmail/",views.get_id_by_email, name="getIdByEmail"),
    # delete apis
    path('deleteAllAdmins/', views.delete_all_admins, name='deleteAllAdmins'),
    path('deleteAdminById/', views.delete_admin_by_id, name='deleteAdminById'),
    path('deleteAllMentors/', views.delete_all_mentors, name='deleteAllMentors'),
    path('deleteMentorById/', views.delete_mentor_by_id, name='deleteMentorById'),
    path('deleteAllMentees/', views.delete_all_mentees, name='deleteAllMentees'),
    path('deleteMenteeById/', views.delete_mentee_by_id, name='deleteMenteeById'),
    # add apis
    path('addAdmin/', views.add_admin, name='addAdmin'),
    path('addMentor/', views.add_mentor, name='addMentor'),
    path('addMentee/', views.add_mentee, name='addMentee'),
    path('addCandidate/', views.add_candidate, name='addCandidate'),
    
    # edit apis
    path('editAdminById/', views.edit_admin_by_id, name='editAdminById'),
    path('editMentorById/', views.edit_mentor_by_id, name='editMentorById'),
    path('editMenteeById/', views.edit_mentee_by_id, name='editMenteeById'),

    path('uploadCSV/', views.upload_CSV, name='uploadCSV'),
    # meetings apis
    path('addMeeting/', views.add_meeting, name='addMeeting'),
    path('editMeetingById/', views.edit_meeting_by_id, name='editMeetingById'),
    path('deleteMeetingById/', views.delete_meeting_by_id, name='deleteMeetingById'),
    path('getMeetings/', views.get_meetings, name='getMeetings'),
    path('getAttendance/', views.get_attendance, name='getAttendance'),
    path('updateAttendance/', views.update_attendance, name='updateAttendance'),
    # mentor mentee pairing
    path('createMentorMenteePair/', views.create_mentor_mentee_pairs, name='createMentorMenteePair'),

    #forms 
    path('submitConsentForm/', views.submit_consent_form, name='submitConsentForm'),
    path('getFormResponse/', views.get_form_response, name='getFormResponse'),
    path('getFormStatus/', views.get_form_status, name='getFormStatus'),
    path('updateFormStatus/', views.update_form_status, name='updateFormStatus'),
    path('menteeFilledFeedback/', views.mentee_filled_feedback, name='menteeFilledFeedback'),
    path('sendConsentForm/', views.send_consent_form, name='sendConsentForm'),


    path('getMailSubjectAndBody/', views.get_mail_subject_and_body, name="getMailSubjectAndBody"),
]



"""

Yes, you can certainly organize your Django views into multiple files to keep your codebase modular and more manageable. Here's an example of how you can achieve this:

1. **Create a `views` directory:**
   Inside your Django app directory, create a new directory named `views`.

   ```
   your_app/
   ├── __init__.py
   ├── views/
   │   ├── __init__.py
   │   ├── view_file1.py
   │   ├── view_file2.py
   │   └── ...
   ├── models.py
   ├── urls.py
   └── ...
   ```

2. **Organize views into separate files:**
   Inside the `views` directory, create individual Python files for different sections or functionalities of your views. For example:

   - `view_file1.py`
   ```python
   from django.shortcuts import render

   def section1_view(request):
       # code for section 1
       return render(request, 'section1_template.html', context)
   ```

   - `view_file2.py`
   ```python
   from django.shortcuts import render

   def section2_view(request):
       # code for section 2
       return render(request, 'section2_template.html', context)
   ```

3. **Import and use in the main view file:**
   In your main view file (e.g., `views.py`), you can import the functions from the subfiles and use them.

   ```python
   from .views.view_file1 import section1_view
   from .views.view_file2 import section2_view

   def my_view(request):
       result1 = section1_view(request)
       result2 = section2_view(request)
       # Combine results and return response
   ```

4. **Update URL patterns:**
   If you've organized your views into subfiles, you need to make sure your URL patterns in `urls.py` are updated accordingly.

   ```python
   from django.urls import path
   from .views import my_view

   urlpatterns = [
       path('my-view/', my_view, name='my_view'),
       # Add other URL patterns as needed
   ]
   ```

By organizing your views into separate files, you can maintain a cleaner and more modular code structure, making it easier to understand, maintain, and extend your Django application.
"""