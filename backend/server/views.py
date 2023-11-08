from io import StringIO
from django.shortcuts import render, HttpResponse
from django.core import serializers
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import csv
from datetime import datetime
from django.shortcuts import get_list_or_404


# Create your views here.
def get_all_admins(request):
    # returns list of json ; [{details},{details},...]
    if request.method == "GET":
        admins = Admin.objects.all()  # Fetch all Admin objects from the database.
        return JsonResponse(list[admins], safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})

def get_admin_by_id(request):
    # returns list of json with one element; [{details}]
    if request.method == "GET":
        id_to_search = json.loads(request.body.decode('utf-8')).get('id')
        admin = Admin.objects.filter(id=id_to_search)
        return JsonResponse(list[admin], safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})

def get_admin_by_attribute(request):
    # input {'key': columnname, 'value': valuetosearch}
    # returns list of json with one element; [{details}]
    if request.method == "GET":
        column_to_search = request.GET.get('column')
        value_to_search = request.GET.get('value')
        if not column_to_search or not value_to_search:
            return JsonResponse({"message": "Both 'column' and 'value' parameters are required."}, status=400)

        admin = Admin.objects.filter(**{column_to_search: value_to_search}).values()
        admin = admin[0]
        return JsonResponse(list[admin], safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})

def get_all_mentors(request):
    # returns list of json ; [{details}, {details}, ...]
    if request.method == "GET":
        mentors_from_candidates = Candidate.objects.filter(status=3).values()
        for mentor in mentors_from_candidates:
            # adding other 'goodiesStatus' and 'reimbursement' details
            id_to_search = mentor['id']
            other_details = Mentor.objects.filter(id=id_to_search).values()
            mentor.update({'goodiesStatus': other_details[0]['goodiesStatus'],
                           'reimbursement': other_details[0]['reimbursement']})
            
            # adding menteesToMentors list
            menteesToMentors = []
            mentees = Mentee.objects.filter(mentor=id_to_search).values()
            for mentee in mentees:
                menteesToMentors.append(mentee['id'])
            mentor.update({'menteesToMentors': menteesToMentors})
            
            # removing unnecessary details
            mentor.pop("status")
        return JsonResponse(list[mentor], safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})
    
def get_mentor_by_id(request):
    # returns list of json with one element; [{details}]
    if request.method == "GET":
        id_to_search = json.loads(request.body.decode('utf-8')).get('id')
        mentor = Candidate.objects.filter(status=3, id=id_to_search).values()

        # adding 'goodiesStatus' and 'reimbursement' details
        other_details = Mentor.objects.filter(id=id_to_search).values()
        mentor[0].update({'goodiesStatus': other_details[0]['goodiesStatus'],
                        'reimbursement': other_details[0]['reimbursement']})
        
        # adding menteesToMentors list
        menteesToMentors = []
        mentees = Mentee.objects.filter(mentor_id=id_to_search).values()
        for mentee in mentees:
            menteesToMentors.append(mentee['id'])
        mentor[0].update({'menteesToMentors': menteesToMentors})
        
        # removing unnecessary details
        mentor[0].pop("status")
        return JsonResponse(list[mentor], safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})

def get_mentor_by_attribute(request):
    if request.method == "GET":
        column_to_search = request.GET.get('column')
        value_to_search = request.GET.get('value')
        
        if not column_to_search or not value_to_search:
            return JsonResponse({"message": "Both 'column' and 'value' parameters are required."}, status=400)

        mentor = Candidate.objects.filter(status=3, **{column_to_search: value_to_search}).values()

        if not mentor:
            return JsonResponse({"message": "Mentor not found."}, status=404)

        mentor = mentor[0]

        # adding 'goodiesStatus' and 'reimbursement' details
        other_details = Mentor.objects.filter(id=mentor['id']).values()
        mentor[0].update({'goodiesStatus': other_details[0]['goodiesStatus'],
                        'reimbursement': other_details[0]['reimbursement']})
        
        # adding menteesToMentors list
        menteesToMentors = []
        mentees = Mentee.objects.filter(mentor_id=mentor['id']).values()
        for mentee in mentees:
            menteesToMentors.append(mentee['id'])
        mentor[0].update({'menteesToMentors': menteesToMentors})
        
        # removing unnecessary details
        mentor[0].pop("status")
        return JsonResponse(list[mentor], safe=False)
    else:
        return 
    

def get_all_mentees(request):
    # returns list of json ; [{details}, {details}, ...]
    if request.method == "GET":
        mentees = Mentee.objects.all().values()
        for mentee in mentees:
            # adding other 'mentorName' and 'mentorEmail' details
            mentor_id_to_search = mentee['mentor_id']
            mentor = Candidate.objects.filter(id=mentor_id_to_search).values()
            mentee.update({'mentorName': mentor[0]['name'],
                           'mentorEmail': mentor[0]['email']})
            # removing unnecessary details
            mentee.pop("mentor_id")
        return JsonResponse(list(mentees), safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})

def get_mentee_by_id(request):
    # returns list of json with one element; [{details}]
    if request.method == "GET":
        id_to_search = json.loads(request.body.decode('utf-8')).get('id')
        mentees = Mentee.objects.filter(id=id_to_search).values()
        for mentee in mentees:
            # adding other 'mentorName' and 'mentorEmail' details
            mentor_id_to_search = mentee['mentor_id']
            mentor = Candidate.objects.filter(id=mentor_id_to_search).values()
            mentee.update({'mentorName': mentor[0]['name'],
                           'mentorEmail': mentor[0]['email']})
            # removing unnecessary details
            mentee.pop("mentor_id")
        return JsonResponse(list(mentees), safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})

def get_mentee_by_attribute(request):
    # input {'key': columnname, 'value': valuetosearch}
    # returns list of json with one element; [{details}]
    if request.method == "GET":
        column_to_search = request.GET.get('column')
        value_to_search = request.GET.get('value')
        if not column_to_search or not value_to_search:
            return JsonResponse({"message": "Both 'column' and 'value' parameters are required."}, status=400)

        mentees = Mentee.objects.filter(**{column_to_search: value_to_search}).values()
        for mentee in mentees:
            # adding other 'mentorName' and 'mentorEmail' details
            mentor_id_to_search = mentee['mentor_id']
            mentor = Candidate.objects.filter(id=mentor_id_to_search).values()
            mentee.update({'mentorName': mentor[0]['name'],
                           'mentorEmail': mentor[0]['email']})
            # removing unnecessary details
            mentee.pop("mentor_id")
        serialized_data = serializers.serialize('json', mentees)  # Serialize the queryset to JSON.
        return JsonResponse(serialized_data, safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})

def get_id_by_email(request):
    email = request.GET.get('email', None)
    role = request.GET.get('role', None)
    print(role)
    if not email or not role:
        return JsonResponse({'error': 'Invalid email or role'}, status=400)
    
    if role == "admin":
        entry = Admin.objects.get(email=email)
    elif role == "mentor":
        entry = Candidate.objects.get(email=email)
    elif role == "mentee":
        entry = Mentee.objects.get(email=email)

    data_dict = {
        'id': entry.id,
        'name': entry.name,
        'email': entry.email
    }
    
    serialized_data = json.dumps(data_dict)
    return JsonResponse(serialized_data, safe=False)



def delete_all_admins(request):
    # returns json ; {"message": "//message//"}
    if request.method == "GET":
        deleted = Admin.objects.all().delete()
        return JsonResponse({"message": "deleted "+str(deleted[0]+" database entries")})
    else:
        return JsonResponse({"message": "Invalid request method"})

def delete_admin_by_id(request):
    # returns json ; {"message": "//message//"}
    if request.method == "GET":
        id_to_search = json.loads(request.body.decode('utf-8')).get('id')
        deleted = Admin.objects.filter(id=id_to_search).delete()
        return JsonResponse({"message": "deleted "+str(deleted[0]+" database entries")})
    else:
        return JsonResponse({"message": "Invalid request method"})

def delete_all_mentors(request):
    # returns json ; {"message": "//message//"}
    if request.method == "GET":
        deleted = Candidate.objects.filter(status=3).delete()
        deleted = Mentor.objects.all().delete()
        return JsonResponse({"message": "deleted "+str(deleted[0]+" database entries")})
    else:
        return JsonResponse({"message": "Invalid request method"})
    
def delete_mentor_by_id(request):
    # returns json ; {"message": "//message//"}
    if request.method == "GET":
        id_to_search = json.loads(request.body.decode('utf-8')).get('id')
        deleted = Candidate.objects.filter(status=3, id=id_to_search).delete()
        deleted = Mentor.objects.filter(id=id_to_search).delete()
        return JsonResponse({"message": "deleted "+str(deleted[0]+" database entries")})
    else:
        return JsonResponse({"message": "Invalid request method"})
    
def delete_all_mentees(request):
    # returns json ; {"message": "//message//"}
    if request.method == "GET":
        deleted = Mentee.objects.all().delete()
        return JsonResponse({"message": "deleted "+str(deleted[0]+" database entries")})
    else:
        return JsonResponse({"message": "Invalid request method"})

def delete_mentee_by_id(request):
    # returns json ; {"message": "//message//"}
    if request.method == "GET":
        id_to_search = json.loads(request.body.decode('utf-8')).get('id')
        deleted = Mentee.objects.filter(id=id_to_search).delete()
        return JsonResponse({"message": "deleted "+str(deleted[0]+" database entries")})
    else:
        return JsonResponse({"message": "Invalid request method"})

@csrf_exempt
def add_admin(request):
    # returns json ; {"message": "//message//"}
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        new_admin = Admin(id=data.get('id'), name=data.get('name'), email=data.get('email'),
                          department=data.get('department'), phone=data.get('phone'),
                          address=data.get('address'), imgSrc=data.get('imgSrc'))
        new_admin.save()
        return JsonResponse({"message": "data added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})

@csrf_exempt
def add_mentor(request):
    # returns json ; {"message": "//message//"}
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        new_candidate = Candidate(id=data.get('id'), name=data.get('name'), email=data.get('email'),
                          department=data.get('department'), year=data.get('year'),
                          size=data.get('size'), score=data.get('score'),
                          status=3, imgSrc=data.get('imgSrc'))
        new_candidate.save()
        
        new_mentor = Mentor(id=data.get('id'), goodiesStatus=data.get('goodiesStatus'),
                            reimbursement=data.get('reimbursement'))
        new_mentor.save()
        
        for mentee_id in data.get('menteesToMentors'):
            mentee = Mentee.objects.get(id=mentee_id)
            mentee.mentor_id = data.get('id')
            mentee.save()
        
        return JsonResponse({"message": "data added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})

@csrf_exempt
def add_mentee(request):
    # returns json ; {"message": "//message//"}
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        new_mentee = Mentee(id=data.get('id'), name=data.get('name'), email=data.get('email'),
                          department=data.get('department'), imgSrc=data.get('imgSrc'))

        mentor = Candidate.objects.filter(status=3, email=data.get('mentorEmail'))
        new_mentee.mentor_id = mentor[0].id
        new_mentee.save()
        return JsonResponse({"message": "data added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})


@csrf_exempt
def add_candidate(request):
    # returns json ; {"message": "//message//"}
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        new_candidate = Candidate(id=data.get('id'), name=data.get('name'), email=data.get('email'),
                          department=data.get('department'), year=data.get('year'),
                          size=data.get('size'), score=data.get('score'),
                          status=1, imgSrc=data.get('imgSrc'))
        new_candidate.save()
        
        return JsonResponse({"message": "data added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})


@csrf_exempt
def edit_admin_by_id(request):
    # returns json ; {"message": "//message//"}
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        admin = Admin.objects.get(id=data.get('id'))
        
        if(data.get('fieldName')=="name"):
            admin.name = data.get('newValue')
        elif(data.get('fieldName')=="email"):
            admin.email = data.get('newValue')
        elif(data.get('fieldName')=="department"):
            admin.department = data.get('newValue')
        elif(data.get('fieldName')=="phone"):
            admin.phone = data.get('newValue')
        elif(data.get('fieldName')=="address"):
            admin.address = data.get('newValue')
        elif(data.get('fieldName')=="imgSrc"):
            admin.imgSrc = data.get('newValue')

        admin.save()
        return JsonResponse({"message": "data added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})

@csrf_exempt
def edit_mentor_by_id(request):
    # returns json ; {"message": "//message//"}
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        candidate = Candidate.objects.get(id=data.get('id'))
        mentor = Mentor.objects.get(id=data.get('id'))

        if(data.get('fieldName')=="name"):
            candidate.name = data.get('newValue')
        elif(data.get('fieldName')=="email"):
            candidate.email = data.get('newValue')
        elif(data.get('fieldName')=="department"):
            candidate.department = data.get('newValue')
        elif(data.get('fieldName')=="imgSrc"):
            candidate.imgSrc = data.get('newValue')
        elif(data.get('fieldName')=="year"):
            candidate.year = data.get('newValue')
        elif(data.get('fieldName')=="size"):
            candidate.size = data.get('newValue')
        elif(data.get('fieldName')=="score"):
            candidate.score = data.get('newValue')
        elif(data.get('fieldName')=="goodiesStatus"):
            mentor.goodiesStatus = data.get('newValue')
        elif(data.get('fieldName')=="reimbursement"):
            mentor.reimbursement = data.get('newValue')
        elif(data.get('fieldName')=="menteesToMentors"):
            for mentee_id in data.get('newValue'):
                mentee = Mentee.objects.get(id=mentee_id)
                mentee.mentor_id = data.get('id')

        candidate.save()
        mentor.save()
        return JsonResponse({"message": "data added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})

@csrf_exempt
def edit_mentee_by_id(request):
    # returns json ; {"message": "//message//"}
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        mentee = Mentee.objects.get(id=data.get('id'))

        if(data.get('fieldName')=="name"):
            mentee.name = data.get('newValue')
        elif(data.get('fieldName')=="email"):
            mentee.email = data.get('newValue')
        elif(data.get('fieldName')=="department"):
            mentee.department = data.get('newValue')
        elif(data.get('fieldName')=="imgSrc"):
            mentee.imgSrc = data.get('newValue')
        elif(data.get('fieldName')=="mentorId"):
            mentee.mentor_id = data.get('newValue')            

        mentee.save()
        return JsonResponse({"message": "data added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})

@csrf_exempt
def upload_CSV(request):
    if request.method == 'POST':
        # Check if a file was uploaded
        if 'csvFile' in request.FILES:
            
            uploaded_file = request.FILES['csvFile']
            file_contents = uploaded_file.read()
            csv_data = file_contents.decode('iso-8859-1')
            # Use StringIO to simulate a file-like object for csv.reader
            csv_io = StringIO(csv_data)
            # Parse the CSV data
            csv_reader = csv.reader(csv_io)
            csv_list = [row for row in csv_reader]
            # Convert the CSV data to a list of dictionaries
            header = csv_list[0]
            csv_data_list = [dict(zip(header, row)) for row in csv_list[1:]]
            Mentee.objects.all().delete()
            for item in csv_data_list:
                mentee = Mentee(
                    id=item['id'],
                    email=item['email'],
                    name=item['name'],
                    department=item['department'],
                    imgSrc="",  # Set the imgSrc and mentor_id as needed
                    mentor_id=""  # Set the mentor_id as needed
                )
                mentee.save()

            return JsonResponse({'message': 'File uploaded and processed successfully'})
        else:
            return JsonResponse({'message': 'No file was uploaded'}, status=400)
    else:
        return JsonResponse({'message': 'Unsupported HTTP method'}, status=405)
    

def index(request):
    return HttpResponse("home")



@csrf_exempt
def add_meeting(request):
    # returns json ; {"message": "//message//"}
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        print(data)
        scheduler_id = data.get('schedulerId')
        date = data.get('date')
        time = data.get('time')
        attendeelist=data.get('attendee')
        attendeevalue = -1
        if "Mentees" in attendeelist and "Mentors" in attendeelist:
            attendeevalue = 3
        elif "Mentors" in attendeelist:
            attendeevalue = 1
        elif "Mentees" in attendeelist:
            attendeevalue = 2

        # Check if a meeting with the same scheduler_id, date, and time already exists
        existing_meeting = Meetings.objects.filter(
            scheduler_id=scheduler_id,
            date=date,
            time=time
        ).first()

        if existing_meeting:
            return JsonResponse({"message": "Meeting already scheduled at the same date and time"})
        else:
            new_meeting = Meetings(
                scheduler_id=scheduler_id,
                date=date,
                time=time,
                attendee=attendeevalue,
                description=data.get('description')
            )
            new_meeting.save()
            return JsonResponse({"message": "Data added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})

@csrf_exempt
def edit_metting_by_id(request):
    # returns json ; {"message": "//message//"}
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        meeting = Meetings.objects.get(meeting_id=data.get('id'))
        meeting.scheduler_id = data.get('scheduler_id')
        meeting.date = data.get('date')
        meeting.time = data.get('time')
        meeting.attendee = data.get('attendee')
        meeting.description = data.get('description')
        
        meeting.save()
        return JsonResponse({"message": "data added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})


def get_meetings(request):
    if request.method == "POST":
        user_type = request.POST.get('user_type')  # You should provide the user type in the request
        user_id = request.POST.get('user_id')  # You should provide the user's ID in the request

        # Get the current date and time
        current_datetime = datetime.now()

        if user_type == "admin":
            # Return all meetings
            all_meetings = Meetings.objects.all()
        elif user_type == "mentor":
            # Return meetings organized by the mentor, and meetings where the mentor is an attendee (1 or 3)
            organized_meetings = Meetings.objects.filter(scheduler_id=user_id)
            attendee_meetings = Meetings.objects.filter(attendee__in=[1, 3])  # Include 1 (mentor) and 3 (both mentor and mentee)
            all_meetings = organized_meetings | attendee_meetings
        elif user_type == "mentee":
            # Return meetings organized by the mentee's mentor and meetings where the mentee is an attendee
            mentor = Mentee.objects.get(id=user_id).mentor_id
            mentor_meetings = Meetings.objects.filter(scheduler_id=mentor)
            attendee_meetings = Meetings.objects.filter(attendee__in=[2, 3])  # Include 2 (mentee) and 3 (both mentor and mentee)
            all_meetings = mentor_meetings | attendee_meetings
        else:
            return JsonResponse({"message": "Invalid user type"})

        # Create lists for previous, next, and upcoming meetings
        previous_meetings = []
        next_meetings = []
        upcoming_meetings = []

        # Categorize meetings based on their date and time
        for meeting in all_meetings:
            meeting_date = datetime.strptime(f"{meeting.date} {meeting.time}", '%Y-%m-%d %I:%M %p')
            if meeting_date < current_datetime:
                previous_meetings.append(meeting)
            elif meeting_date > current_datetime:
                upcoming_meetings.append(meeting)
            else:
                next_meetings.append(meeting)

        # Create a dictionary to store the categorized meetings
        meetings_data = {
            "previous_meetings": previous_meetings,
            "next_meetings": next_meetings,
            "upcoming_meetings": upcoming_meetings,
        }

        # Serialize the data
        serialized_data = serializers.serialize("json", meetings_data)
        return JsonResponse(serialized_data, safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})


# def mentor_mentee_mapping(request):
#     # Initialize dictionaries to track mentors and their assigned mentees
#     mentors = {}
#     assigned_mentees = {}
#     mentees_per_mentor = 5

#     # Get a list of all candidates, sorted by department and score in descending order
#     candidates = Candidate.objects.order_by('-department', '-score')

#     for candidate in candidates:
#         if candidate.department not in mentors:
#             # If there are no mentors for this department, add one
#             mentors[candidate.department] = [candidate]
#             assigned_mentees[candidate.id] = candidate.department
#         else:
#             # Check if the mentor already has enough mentees
#             mentor_department = assigned_mentees[candidate.id]
#             if len(mentors[mentor_department]) < mentees_per_mentor:
#                 mentors[mentor_department].append(candidate)
#             else:
#                 # If the mentor has enough mentees, assign the mentee to another mentor in the same department
#                 for mentor_id in mentors[mentor_department]:
#                     if len(mentors[mentor_department]) < mentees_per_mentor:
#                         mentors[mentor_department].append(candidate)
#                         assigned_mentees[candidate.id] = mentor_department
#                         break

#     # Return the mentor-mentee mapping
#     return mentors
