from io import StringIO
import math
import random
from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from .models import *
import csv
from datetime import datetime
from django.db import transaction
from django.core.mail import send_mail
from django.conf import settings
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
import threading


def get_all_admins(request):
    # returns list of json ; [{details},{details},...]
    if request.method == "GET":
        admins = Admin.objects.all().values()  # Fetch all Admin objects from the database.
        return JsonResponse(admins, safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})

def get_admin_by_id(request):
    # returns list of json with one element; [{details}]
    if request.method == "GET":
        id_to_search = json.loads(request.body.decode('utf-8')).get('id')
        admin = Admin.objects.filter(id=id_to_search).values()
        return JsonResponse(list(admin), safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})

#Done
def get_all_mentors(request):
    # returns list of json ; [{details}, {details}, ...]
    if request.method == "GET":
        mentors_from_candidates = Candidate.objects.filter(status=5).values()
        for mentor in mentors_from_candidates:
            # adding other 'goodiesStatus' details
            id_to_search = mentor['id']
            other_details = Mentor.objects.filter(id=id_to_search).values()
            mentor.update({'goodiesStatus': other_details[0]['goodiesStatus']})
            # adding menteesToMentors list
            menteesToMentors = []
            mentees = Mentee.objects.filter(mentorId=str(id_to_search)).values()
            
            for mentee in mentees:
                menteesToMentors.append([mentee['id'], mentee['name'], mentee['email'], mentee['contact']])
            mentor.update({'menteesToMentors': menteesToMentors})
        return JsonResponse(list(mentors_from_candidates), safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})

#Done
@csrf_exempt 
def get_mentor_by_id(request):
    # returns list of json with one element; [{details}]
    if request.method == "POST":
        id_to_search = json.loads(request.body.decode('utf-8')).get('id')
        mentor = Candidate.objects.filter(status=5, id=id_to_search).values()

        # adding 'goodiesStatus' details
        other_details = Mentor.objects.filter(id=id_to_search).values()
        if len(mentor) == 0:
            return JsonResponse({"message": "Mentor Not Found"})
        mentor[0].update({'goodiesStatus': other_details[0]['goodiesStatus']})
        # adding menteesToMentors list
        menteesToMentors = []
        mentees = Mentee.objects.filter(mentorId=str(id_to_search)).values()
        for mentee in mentees:
            menteesToMentors.append([mentee['id'], mentee['name'], mentee['email'], mentee['contact']])
        mentor[0].update({'menteesToMentors': menteesToMentors})
        return JsonResponse(mentor[0], safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})

#Done
def get_all_mentees(request):
    # returns list of json ; [{details}, {details}, ...]
    if request.method == "GET":
        mentees = Mentee.objects.all().values()
        for mentee in mentees:
            # adding other 'mentorName' and 'mentorEmail' details
            mentor_id_to_search = mentee['mentorId']
            mentor = Candidate.objects.filter(id=mentor_id_to_search).values()
            if len(mentor): 
                 mentee.update({'mentorId': mentor[0]['id'],
                            'mentorName': mentor[0]['name'],
                            'mentorEmail': mentor[0]['email'],
                            'mentorContact': mentor[0]['contact'],
                            'mentorImage': mentor[0]['imgSrc'],
                            'f3': int(FormStatus.objects.get(formId='3').formStatus)})
            else: 
                mentee.update({'mentorId': 'NULL',
                           'mentorName': 'NULL',
                           'mentorEmail': 'NULL',
                            'mentorContact': 'NULL',
                            'mentorImage': 'NULL',
                            'f3': int(FormStatus.objects.get(formId='3').formStatus)})
        return JsonResponse(list(mentees), safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})

#Done
def get_mentee_by_id(request):
    # returns list of json with one element; [{details}]
    if request.method == "GET":
        id_to_search = json.loads(request.body.decode('utf-8')).get('id')
        mentees = Mentee.objects.filter(id=id_to_search).values()
        for mentee in mentees:
            # adding other 'mentorName' and 'mentorEmail' details
            mentor_id_to_search = mentee['mentorId']
            mentor = Candidate.objects.filter(id=mentor_id_to_search).values()
            if len(mentor): 
                 mentee.update({'mentorId': mentor[0]['id'],
                            'mentorName': mentor[0]['name'],
                            'mentorEmail': mentor[0]['email'],
                            'mentorContact': mentor[0]['contact'],
                            'mentorImage': mentor[0]['imgSrc'],
                            'f3': int(FormStatus.objects.get(formId='3').formStatus)})
            else: 
                mentee.update({'mentorId': 'NULL',
                           'mentorName': 'NULL',
                           'mentorEmail': 'NULL',
                            'mentorContact': 'NULL',
                            'mentorImage': 'NULL',
                            'f3': int(FormStatus.objects.get(formId='3').formStatus)})
        return JsonResponse(list(mentees), safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})

#Done
@csrf_exempt 
def get_id_by_email(request):
    if request.method == "POST":
        email = json.loads(request.body.decode('utf-8')).get('email')
        role = json.loads(request.body.decode('utf-8')).get('role')
        try: 
            if not email or not role:
                return JsonResponse({'error': 'Invalid email or role'})
            
            if role == "admin":
                entry = Admin.objects.filter(email=email).values()
            elif role == "mentor":
                entry = Candidate.objects.filter(email=email).values()
            elif role == "mentee":
                entry = Mentee.objects.filter(email=email).values()
                for mentee in entry:
            # adding other 'mentorName' and 'mentorEmail' details
                    mentor_id_to_search = mentee['mentorId']
                    mentor = Candidate.objects.filter(id=mentor_id_to_search).values()
                    if len(mentor): 
                        mentee.update({'mentorId': mentor[0]['id'],
                                    'mentorName': mentor[0]['name'],
                                    'mentorEmail': mentor[0]['email'],
                                    'mentorContact': mentor[0]['contact'],
                                    'mentorImage': mentor[0]['imgSrc'],
                                    'f3': int(FormStatus.objects.get(formId='3').formStatus)})
                    else: 
                        mentee.update({'mentorId': 'NULL',
                                'mentorName': 'NULL',
                                'mentorEmail': 'NULL',
                                'mentorContact': 'NULL',
                                'mentorImage': 'NULL',
                                'f3': int(FormStatus.objects.get(formId='3').formStatus)})
            if(len(entry) == 0):
                data_dict = {
                    'id': -1,
                    'f1': int(FormStatus.objects.get(formId='1').formStatus)
                }
                serialized_data = json.dumps(data_dict)
                return JsonResponse(serialized_data, safe=False)
            return JsonResponse(entry[0], safe=False)
        except: 
            data_dict = {
                    'id': -1
                }
            serialized_data = json.dumps(data_dict)
            return JsonResponse(serialized_data, safe=False)
    else: 
        return JsonResponse({"message": "Invalid request method"})

def delete_all_admins(request):
    # returns json ; {"message": "//message//"}
    if request.method == "GET":
        deleted = Admin.objects.all().delete()
        return JsonResponse({"message": "deleted "+str(deleted[0])+" database entries"})
    else:
        return JsonResponse({"message": "Invalid request method"})

def delete_admin_by_id(request):
    # returns json ; {"message": "//message//"}
    if request.method == "GET":
        id_to_search = json.loads(request.body.decode('utf-8')).get('id')
        deleted = Admin.objects.filter(id=id_to_search).delete()
        return JsonResponse({"message": "deleted "+str(deleted[0])+" database entries"})
    else:
        return JsonResponse({"message": "Invalid request method"})

def delete_all_mentors(request):
    # returns json ; {"message": "//message//"}
    if request.method == "GET":
        deleted = Candidate.objects.filter(status=5).delete()
        deleted = Mentor.objects.all().delete()
        return JsonResponse({"message": "deleted "+str(deleted[0])+" database entries"})
    else:
        return JsonResponse({"message": "Invalid request method"})

#Done   
@csrf_exempt
def delete_mentor_by_id(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        mentor_id = data.get('id')
        try:
            mentor_department = Candidate.objects.get(id=mentor_id).department
            highest_score_mentor = Candidate.objects.filter(
                status=3,
                department=mentor_department
            ).order_by('-score').values()
            if(len(highest_score_mentor) == 0):
                return JsonResponse({"message": "No new mentor to replace"})
            highest_score_mentor = highest_score_mentor[0]
            Mentee.objects.filter(mentorId=mentor_id).update(mentorId=highest_score_mentor["id"])
            deleted = Mentor.objects.filter(id=mentor_id).delete()
            candidate = Candidate.objects.get(id=mentor_id)
            candidate.status = -1
            candidate.save()
            highest_score_mentor_id = highest_score_mentor["id"]
            candidate_new = Candidate.objects.get(id=highest_score_mentor_id)
            candidate_new.status = 5
            candidate_new.save()
            mentor = Mentor(id = highest_score_mentor["id"], goodiesStatus = 0)
            mentor.save()
            return JsonResponse({"message": f"Repalced Mentor ID: {highest_score_mentor_id}"})
        except Candidate.DoesNotExist:
            return JsonResponse({"message": "Mentor not found"})
    else:
        return JsonResponse({"message": "No new mentor to replace"})

def delete_all_mentees(request):
    # returns json ; {"message": "//message//"}
    if request.method == "GET":
        deleted = Mentee.objects.all().delete()
        return JsonResponse({"message": "deleted "+str(deleted[0])+" database entries"})
    else:
        return JsonResponse({"message": "Invalid request method"})

#Done
@csrf_exempt
def delete_mentee_by_id(request):
    # returns json ; {"message": "//message//"}
    if request.method == "POST":
        id_to_search = json.loads(request.body.decode()).get('id')
        deleted = Mentee.objects.filter(id=str(id_to_search)).delete()
        return JsonResponse({"message": "deleted "+str(deleted[0])+" database entries"})
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
                          size=data.get('size'), score=data.get('score'),contact=data.get('contact'),
                          status=5, imgSrc=data.get('imgSrc'))
        new_candidate.save()
        
        new_mentor = Mentor(id=data.get('id'), goodiesStatus=data.get('goodiesStatus'))
        new_mentor.save()
        
        for mentee_id in data.get('menteesToMentors'):
            mentee = Mentee.objects.get(id=mentee_id)
            mentee.mentorId = data.get('id')
            mentee.save()
        
        return JsonResponse({"message": "data added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})

#Done
@csrf_exempt
def add_mentee(request):
    # returns json ; {"message": "//message//"}
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        existing_mentee = Mentee.objects.filter(id=data.get('id')).first()
        if existing_mentee:
            return JsonResponse({"message": "Mentee with this ID already exist"})
        new_mentee = Mentee(id=data.get('id'), name=data.get('name'), email=data.get('email'),
                          department=data.get('department'))
        mentor = Candidate.objects.filter(status=5, id=str(data.get('mentorId')), department=str(data.get('department'))).values()
        if(data.get('imgSrc')):
            new_mentee.imgSrc = data.get('imgSrc')
        if len(mentor) == 0: 
            return JsonResponse({"message": "Mentor Not Found"})
        new_mentee.mentorId = mentor[0]['id']
        new_mentee.save()
        return JsonResponse({"message": "Mentee added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})


#Done
@csrf_exempt
def add_candidate(request):
    # returns json ; {"message": "//message//"}
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        responses = {
            'rq1': data.get('rq1'),
            'rq2': data.get('rq2'),
            'rq3': data.get('rq3'),
            'rq4': data.get('rq4'),
            'rq5': data.get('rq5'),
            'rq6': data.get('rq6'),
        }

        scoring_rules = {
            'rq1': [0, 0, 5, 3, 1, 4],
            'rq2': [4, 3, 1, 4, 5, 2],
            'rq3': [1, 2, 0, 5, 2, 3],
            'rq4': [3, 2, 0, 1, 5, 4],
            'rq5': [5, 0, 2, 3, 4, 1],
            'rq6': [3, 2, 4, 1, 5, 4],
        }

        scores = {key: scoring_rules[key][value] for key, value in responses.items()}
        score = sum(scores.values())
        responses["score"] = score
        form = FormStatus.objects.get(formId=2)
        if form.formStatus == '1': 
            status=2
        else:
            status=1
        new_candidate = Candidate(id=data.get('id'), name=data.get('name'), email=data.get('email'),
                          department=data.get('department'), year=data.get('year'), contact=data.get('contact'),
                          score=score,
                          status=status)
        if(data.get('imgSrc')):
            new_candidate.imgSrc = data.get('imgSrc')
        new_candidate.save()

        new_responses = FormResponses(
            submitterId=data.get('id'),
            FormType='1',
            responses=responses
        )

        # Save the new FormResponses instance
        new_responses.save()
        subject = "Registragtion From Filled"
        message = "Registragtion form successfully filled. Please wait for furter Instructions"
        thread = threading.Thread(target=send_emails_to, args=(subject, message, settings.EMAIL_HOST_USER, [new_candidate.email]))
        thread.start()
        
        
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
        elif(data.get('fieldName')=="contact"):
            candidate.contact = data.get('newValue')
        elif(data.get('fieldName')=="goodiesStatus"):
            mentor.goodiesStatus = data.get('newValue')
        elif(data.get('fieldName')=="menteesToMentors"):
            for mentee_id in data.get('newValue'):
                mentee = Mentee.objects.get(id=mentee_id)
                mentee.mentorId = data.get('id')

        candidate.save()
        mentor.save()
        return JsonResponse({"message": "data added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})

#Done
@csrf_exempt
def edit_mentee_by_id(request):
    # returns json ; {"message": "//message//"}
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        existing_mentee = Mentee.objects.filter(id=data.get('id')).first()
        if existing_mentee:
            mentor = Candidate.objects.filter(status=5, id=str(data.get('mentorId')), department=str(data.get('department'))).values()
            if len(mentor) == 0: 
                return JsonResponse({"message": "Mentor Not Found Make sure that the mentor exist and have same department"})
            existing_mentee.mentorId = mentor[0]['id']
            existing_mentee.save()
            return JsonResponse({"message": "Mentee Details Updated successfully"})
        else: 
            return JsonResponse({"message": "No such mentee Exist"})
       
        # if(data.get('fieldName')=="name"):
        #     mentee.name = data.get('newValue')
        # elif(data.get('fieldName')=="email"):
        #     mentee.email = data.get('newValue')
        # elif(data.get('fieldName')=="department"):
        #     mentee.department = data.get('newValue')
        # elif(data.get('fieldName')=="imgSrc"):
        #     mentee.imgSrc = data.get('newValue')
        # elif(data.get('fieldName')=="mentorId"):
            # mentee.mentorId = data.get('newValue')            

    else:
        return JsonResponse({"message": "Invalid request method"})

#Done
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
                program = item['Program']
                branch = item['Branch']

                if program == 'B.Tech.':
                    department = 'B-' + branch
                elif program == 'M.Tech.':
                    department = 'M-' + branch
                else:
                    department = 'Unknown'
                mentee = Mentee(
                    id=item['Roll'],
                    name=item['Name'],
                    email=item['Email'],
                    contact=item['Contact'],
                    mentorId = '',
                    department= department
                )
                if 'Image' in item:
                    mentee.imgSrc = item["Image"]
                mentee.save()

            return JsonResponse({'message': 'File uploaded and processed successfully'})
        else:
            return JsonResponse({'message': 'No file was uploaded'}, status=400)
    else:
        return JsonResponse({'message': 'Unsupported HTTP method'}, status=405)
    
def index(request):
    return HttpResponse("home")

#Done
@csrf_exempt
def add_meeting(request):
    # returns json ; {"message": "//message//"}
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        scheduler_id = data.get('schedulerId')
        date = data.get('date')
        time = data.get('time')
        attendeelist = data.get('attendee')
        attendeevalue = -1
        mentorBranches = data.get('mentorBranches', [])

        if "Mentees" in attendeelist and "Mentors" in attendeelist:
            attendeevalue = 3
        elif "Mentors" in attendeelist:
            attendeevalue = 1
        elif "Mentees" in attendeelist:
            attendeevalue = 2

        # Check if a meeting with the same scheduler_id, date, and time already exists
        existing_meeting = Meetings.objects.filter(
            schedulerId=scheduler_id,
            date=date,
            time=time
        ).first()

        if existing_meeting:
            return JsonResponse({"error": "Meeting already scheduled at the same date and time"})
        else:
            new_meeting = Meetings(
                title=data.get('title'),
                schedulerId=scheduler_id,
                date=date,
                time=time,
                attendee=attendeevalue,
                description=data.get('description'),
                mentorBranches=mentorBranches 
            )
            new_meeting.save()
            thread = threading.Thread(target=send_emails_to_attendees, args=(new_meeting, 1))
            thread.start()
            return JsonResponse({"message": "Data added successfully"})
    else:
        return JsonResponse({"error": "Invalid request method"})


#Done
@csrf_exempt
def edit_meeting_by_id(request):
    # returns json ; {"message": "//message//"}
    
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        meeting = Meetings.objects.get(meetingId=data.get('meetingId'))
        meeting.title = data.get('title')
        meeting.schedulerId = data.get('schedulerId')
        meeting.date = data.get('date')
        meeting.time = data.get('time')
        attendeevalue = -1
        attendeelist = data.get('attendee')
        if "Mentees" in attendeelist and "Mentors" in attendeelist:
            attendeevalue = 3
        elif "Mentors" in attendeelist:
            attendeevalue = 1
        elif "Mentees" in attendeelist:
            attendeevalue = 2
        meeting.attendee = attendeevalue
        meeting.description = data.get('description')
        meeting.mentorBranches = data.get('mentorBranches', [])
        existing_meeting = Meetings.objects.filter(
            schedulerId=data.get('schedulerId'),
            date=data.get('date'),
            time=data.get('time')
        ).first()
        if existing_meeting and existing_meeting.meetingId != data.get('meetingId'):
            return JsonResponse({"message": "Meeting already scheduled at the same date and time"})
        meeting.save()
        thread = threading.Thread(target=send_emails_to_attendees, args=(meeting, 2))
        thread.start()
        return JsonResponse({"message": "data added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})
    
#Done
@csrf_exempt
def delete_meeting_by_id(request):
    if request.method == "POST":
        id_to_search = json.loads(request.body.decode('utf-8')).get('meetingId')
        meeting = Meetings.objects.get(meetingId=id_to_search)
        thread = threading.Thread(target=send_emails_to_attendees, args=(meeting, 3))
        thread.start()
        deleted = Meetings.objects.filter(meetingId=id_to_search).delete()
        return JsonResponse({"message": "deleted "+str(deleted[0])+" database entries"})
    else:
        return JsonResponse({"message": "Invalid request method"})

#Done
@csrf_exempt
def get_meetings(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        user_type = data.get('role')
        user_id = data.get('id')
        current_datetime = datetime.now()
        
        if user_type == "admin":
            all_meetings = Meetings.objects.all().values()
        elif user_type == "mentor":
            try:
                mentor_department = Candidate.objects.get(id=user_id).department
            except Candidate.DoesNotExist:
                return JsonResponse({"error": "Mentor not found"})
            
            # Return meetings organized by the mentor and meetings where the mentor is an attendee (1 or 3)
            organized_meetings = Meetings.objects.filter(schedulerId=user_id).values()
            attendee_meetings = Meetings.objects.filter(
                attendee__in=[1, 3],
                mentorBranches__contains=[mentor_department]
            ).values()
            all_meetings = organized_meetings | attendee_meetings
        elif user_type == "mentee":
            # Return meetings organized by the mentee's mentor and meetings where the mentee is an attendee
            mentor = Mentee.objects.get(id=user_id).mentorId
            mentor_meetings = Meetings.objects.filter(schedulerId=mentor).values()
            attendee_meetings = Meetings.objects.filter(attendee__in=[2, 3]).values()  # Include 2 (mentee) and 3 (both mentor and mentee)
            all_meetings = mentor_meetings | attendee_meetings
        else:
            return JsonResponse({"message": "Invalid user type"})

        # Create lists for previous, next, and upcoming meetings
        previous_meetings = []
        upcoming_meetings = []

        # Categorize meetings based on their date and time
        for meeting in all_meetings:
            if meeting['attendee'] == 1:
                meeting['attendee'] = ['Mentors']
            elif meeting['attendee'] == 2:
                meeting['attendee'] = ['Mentees']
            elif meeting['attendee'] == 3:
                meeting['attendee'] = ['Mentors', 'Mentees']
            meeting_date = datetime.strptime(f"{meeting['date']} {meeting['time']}", '%Y-%m-%d %H:%M')
            if meeting_date < current_datetime:
                previous_meetings.append(meeting)
            elif meeting_date > current_datetime:
                upcoming_meetings.append(meeting)

        meetings_data = {
            "previousMeeting":  previous_meetings,
            "upcomingMeeting": upcoming_meetings
        }
        return JsonResponse(meetings_data)
    else:
        return JsonResponse({"message": "Invalid request method"})
    
#Done
@csrf_exempt
def get_attendance(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        meeting_id = data.get("meetingId")

        try:
            meeting = Meetings.objects.get(meetingId=meeting_id)
        except Meetings.DoesNotExist:
            return JsonResponse({"error": "Meeting not found"}, status=404)

        scheduler_id = meeting.schedulerId

        attendees_list = []
        attendees = meeting.attendee

        try:
            admin = Admin.objects.get(id=scheduler_id)
            if attendees == 1:  # Mentor
                # Filter mentors based on mentorBranches
                mentors = Candidate.objects.filter(department__in=meeting.mentorBranches).values()
                for mentor in mentors:
                    attendee_info = {}
                    attendee_info["id"] = mentor['id']
                    attendee_info["name"] = mentor['name']
                    attendee_info["email"] = mentor['email']
                    try:
                        attendance = Attendance.objects.get(attendeeId=mentor['id'], meetingId=meeting_id)
                        attendee_info["attendance"] = 1  # Attendee is present
                    except Attendance.DoesNotExist:
                        attendee_info["attendance"] = 0  # Attendee is 
                    attendees_list.append(attendee_info)

            elif attendees == 2:  # Mentee
                mentees = Mentee.objects.all().values()
                for mentee in mentees:
                    attendee_info = {}
                    attendee_info["id"] = mentee['id']
                    attendee_info["name"] = mentee['name']
                    attendee_info["email"] = mentee['email']
                    try:
                        attendance = Attendance.objects.get(attendeeId=mentee['id'], meetingId=meeting_id)
                        attendee_info["attendance"] = 1  # Attendee is present
                    except Attendance.DoesNotExist:
                        attendee_info["attendance"] = 0  # Attendee is absent
                    attendees_list.append(attendee_info)


            elif attendees == 3:  # Both mentor and mentee
                # Filter mentors based on mentorBranches
                mentors = Candidate.objects.filter(department__in=meeting.mentorBranches).values()
                for mentor in mentors:
                    attendee_info = {}
                    attendee_info["id"] = mentor['id']
                    attendee_info["name"] = mentor['name']
                    attendee_info["email"] = mentor['email']
                    try:
                        attendance = Attendance.objects.get(attendeeId=mentor['id'], meetingId=meeting_id)
                        attendee_info["attendance"] = 1  # Attendee is present
                    except Attendance.DoesNotExist:
                        attendee_info["attendance"] = 0  # Attendee is 
                    attendees_list.append(attendee_info)

                mentees = Mentee.objects.all().values()
                for mentee in mentees:
                    attendee_info = {}
                    attendee_info["id"] = mentee['id']
                    attendee_info["name"] = mentee['name']
                    attendee_info["email"] = mentee['email']
                    try:
                        attendance = Attendance.objects.get(attendeeId=mentee['id'], meetingId=meeting_id)
                        attendee_info["attendance"] = 1  # Attendee is present
                    except Attendance.DoesNotExist:
                        attendee_info["attendance"] = 0  # Attendee is absent
                    attendees_list.append(attendee_info)
                             
        except Admin.DoesNotExist:
            # Mentor scheduler, get all mentees of the mentor
            try:
                mentor_mentees = Mentee.objects.filter(mentorId=scheduler_id).values()
                attendees = [mentee['id'] for mentee in mentor_mentees]
                for attendee_id in attendees:
                        attendee_info = {}
                        try:
                            mentee = Mentee.objects.get(id=attendee_id)
                            attendee_info["id"] = mentee.id
                            attendee_info["name"] = mentee.name
                            attendee_info["email"] = mentee.email
                            # Check attendance in the Attendance table
                            try:
                                attendance = Attendance.objects.get(attendeeId=mentee.id, meetingId=meeting_id)
                                attendee_info["attendance"] = 1  # Attendee is present
                            except Attendance.DoesNotExist:
                                attendee_info["attendance"] = 0  # Attendee is absent

                            attendees_list.append(attendee_info)
                        except Mentee.DoesNotExist:
                            return JsonResponse({"error": f"Mentee with ID {attendee_id} not found"}, status=404)
            except Mentee.DoesNotExist:
                return JsonResponse({"error": "Mentor not found or has no mentees"}, status=404)
        print({"attendees": attendees_list})
        return JsonResponse({"attendees": attendees_list})
        
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

#Done
@csrf_exempt
def update_attendance(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))

        attendees = data.get("attendees")
        meeting_id = data.get("meetingId")

        for attendee in attendees:
            attendee_id = attendee.get("id")
            attendance_value = attendee.get("attendance")
            try:
                existing_attendance = Attendance.objects.get(attendeeId=attendee_id, meetingId=meeting_id)
                if attendance_value == 0:
                    existing_attendance.delete()
            except Attendance.DoesNotExist:
                if attendance_value == 1:
                    new_attendance = Attendance(attendeeId=attendee_id, meetingId=meeting_id)
                    new_attendance.save()

        return JsonResponse({"message": "Attendance updated successfully"})
    else:
        return JsonResponse({"error": "Invalid request method"})

@csrf_exempt
def create_mentor_mentee_pairs(request):
    if request.method == "POST":
        try:
            departments = Mentee.objects.values_list('department', flat=True).distinct()
            noMenteeBranch = []
            for department in departments:
                mentees = Mentee.objects.filter(department=department, mentorId='')
                mentee_batch_size = math.ceil(len(mentees) / 5.0)
                candidates = Candidate.objects.filter(status=3, department=department).order_by('-score')[:mentee_batch_size]  
                candidates_dict = {candidate.id: 0 for candidate in candidates}
                if len(candidates_dict) == mentee_batch_size:
                    for mentee in mentees:
                        candidate_id = random.choice([key for key, value in candidates_dict.items() if value < 5])
                        mentee.mentorId = candidate_id
                        mentee.save()
                        candidates_dict[candidate_id] += 1
                    
                    for candidate in candidates:
                        mentor = Mentor(id=candidate.id, goodiesStatus = 0)
                        mentor.save()
                        candidate.status = 5
                        candidate.save()
                else: 
                    noMenteeBranch.append(department)
            if len(noMenteeBranch):
                return JsonResponse({'message': 'Not enough mentor for branches : '+ str(noMenteeBranch)})
            else:
                return JsonResponse({'message': 'Matching successful'})
        except Exception as e:
            return JsonResponse({'message': str(e)})
    else:
        return JsonResponse({"message": "Invalid request method"})

# Done   
@csrf_exempt
def submit_consent_form(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        user_id = data.get('id')

        cq_responses = {
            f'cq{i}': data.get(f'cq{i}', 0) for i in range(1, 12)
        }

        correct_options = sum(value == 1 for value in cq_responses.values())
        cq_responses["score"] = correct_options
        new_responses = FormResponses(
            SubmissionId=None,
            submitterId=user_id,
            FormType='2',
            responses=cq_responses
        )

        new_responses.save()
        candidate = Candidate.objects.get(id=user_id)
        candidate.imgSrc = data.get('imgSrc')
        candidate.size = data.get('size')
        candidate.save()
        if correct_options == 0:
            Candidate.objects.filter(id=user_id).update(status=3)
        subject = "Consent From Filled"
        message = "Consent form successfully filled. Please wait for furter Instructions"
        thread = threading.Thread(target=send_emails_to, args=(subject, message, settings.EMAIL_HOST_USER,[candidate.email]))
        thread.start()
        
        return JsonResponse({"message": "Consent form submitted successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})

# Done
@csrf_exempt
def mentee_filled_feedback(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        responses = {
            'mentorId':data.get('mentorId'),
            'mentorName':data.get('mentorName'),
            'fq1': data.get('fq1'),
            'fq2': data.get('fq2'),
            'fq3': data.get('fq3'),
            'fq4': data.get('fq4'),
        }

        new_responses = FormResponses(
            submitterId=data.get('id'),
            FormType='3',
            responses=responses
        )
        new_responses.save()
        return JsonResponse({"message": "Feedback form submitted successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})

# Done
@csrf_exempt
def get_form_response(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        form_type = data.get("formType")

        try:
            form_responses_objs = FormResponses.objects.filter(FormType=form_type).values()
            form_responses_data = []
            for form_response_obj in form_responses_objs:
                summiter_name = ''
                if form_type == 1 or form_type == 2:
                    summiter_name = Candidate.objects.filter(id=form_response_obj['submitterId']).values()[0]['name']
                if form_type == 3:
                    summiter_name = Mentee.objects.filter(id=form_response_obj['submitterId']).values()[0]['name']
                response_data = {
                    "submitterId": form_response_obj['submitterId'],
                    "submiterName": summiter_name,
                    "responses": form_response_obj['responses'],
                }

                if form_type in ["1", "2"]:
                    mentor_obj = Candidate.objects.get(id=form_response_obj['submitterId'])
                    response_data["submitterName"] = mentor_obj.name
                    response_data["submitterEmail"] = mentor_obj.email

                elif form_type == "3":
                    mentee_obj = Mentee.objects.get(id=form_response_obj['submitterId'])
                    response_data["submitterName"] = mentee_obj.name
                    response_data["submitterEmail"] = mentee_obj.email

                # response_data.update(form_response_obj['responses'])
                form_responses_data.append(response_data)

            print({"formResponses": form_responses_data})
            return JsonResponse({"formResponses": form_responses_data})

        except FormResponses.DoesNotExist:
            return JsonResponse({"error": "FormResponses not found for the given formType"}, status=404)
        
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

#Done
@csrf_exempt
def get_form_status(request):
    if request.method == "POST":
        form = FormStatus.objects.all().values()
        return JsonResponse(list(form), safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})

#Done
@csrf_exempt
def update_form_status(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        formStatus = data.get('formStatus')
        formId=data.get("formId")
        form = FormStatus.objects.get(formId=formId)
        form.formStatus = formStatus
        form.save()
        if int(formId) == 2 and int(formStatus) == 1:
            candidates_with_status_2 = Candidate.objects.filter(status=2).values("email")
            emails = [candidate['email'] for candidate in candidates_with_status_2]
            Candidate.objects.filter(status=1).update(status=2)
            subject = "Consent Form Activated"
            message = "Dear Students,\nWe would like to inform you that the consent form for the recently filled registration form is now activated."
            message = message + " Your prompt action in filling out the consent form is crucial for the successful completion of the process. \n\n\tAction Required: Fill Consent Form"
            thread = threading.Thread(target=send_emails_to, args=(subject, message, settings.EMAIL_HOST_USER, emails))
            thread.start()
        elif int(formId) == 2 and int(formStatus) == 0:
            candidates_with_status_1 = Candidate.objects.filter(status=1).values("email")
            emails = [candidate['email'] for candidate in candidates_with_status_1]
            Candidate.objects.filter(status=2).update(status=1) 
            subject = "Closure of Consent Form Submission"
            message = "Dear Students,\nWe would like to inform you that the submission window for the consent form has now closed. We appreciate your prompt response to this step in our process."
            message = message + "If you have successfully submitted your consent form, we would like to express our gratitude for your cooperation."
            thread = threading.Thread(target=send_emails_to, args=(subject, message, settings.EMAIL_HOST_USER, emails))
            thread.start()
        if int(formId) == 3 and int(formStatus) == 1:
            mentee_list = Mentee.objects.filter().values("email")
            emails = [candidate['email'] for candidate in mentee_list]
            subject = "Feedback Form Activated"
            message = "Dear Students,\nWe would like to inform you that the mentor feedback form has been activated by the admin. Your prompt action in filling out the feedback form is crucial."
            thread = threading.Thread(target=send_emails_to, args=(subject, message, settings.EMAIL_HOST_USER, emails))
            thread.start()
        elif int(formId) == 3 and int(formStatus) == 0:
            mentee_list = Mentee.objects.filter().values("email")
            emails = [candidate['email'] for candidate in mentee_list]
            subject = "Closure of Feedback Form"
            message = "Dear Students,\nWe would like to inform you that the submission window for the Feedback form has now closed. We appreciate your prompt response to this step in our process."
            message = message + "If you have successfully submitted your consent form, we would like to express our gratitude for your cooperation."
            thread = threading.Thread(target=send_emails_to, args=(subject, message, settings.EMAIL_HOST_USER, emails))
            thread.start()
        return JsonResponse({"message": "Form status updated successfully"})
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

#Done
def send_emails_to_attendees(meeting, type):
    """
    1: new meeting
    2: meeting edited
    3: deleted 
    """
    scheduler_id = meeting.schedulerId
    attendees_list = []
    attendees = meeting.attendee
    user_type = ''
    user_name = ''
    user_email = ''

    try:
        admin = Admin.objects.get(id=scheduler_id)
        user_type = 'Admin'
        user_name = admin.name
        user_email = admin.email
        if attendees == 1:  # Mentor
            # Filter mentors based on mentorBranches
            mentors = Candidate.objects.filter(department__in=meeting.mentorBranches).values()
            for mentor in mentors:
                attendees_list.append(mentor['email'])

        elif attendees == 2:  # Mentee
            mentees = Mentee.objects.all().values()
            for mentee in mentees:
                attendees_list.append(mentee['email'])

        elif attendees == 3:  # Both mentor and mentee
            # Filter mentors based on mentorBranches
            mentors = Candidate.objects.filter(department__in=meeting.mentorBranches).values()
            for mentor in mentors:
                attendees_list.append(mentor['email'])

            mentees = Mentee.objects.all().values()
            for mentee in mentees:
                attendees_list.append(mentee['email'])
                   
    except Admin.DoesNotExist:
        # Mentor scheduler, get all mentees of the mentor
        try:
            mentor_mentees = Mentee.objects.filter(mentorId=scheduler_id).values()
            attendees = [mentee['id'] for mentee in mentor_mentees]
            for attendee_id in attendees:
                    attendee_info = {}
                    try:
                        mentee = Mentee.objects.get(id=attendee_id)
                        attendees_list.append(mentee['email'])
                        candidate = Candidate.objects.get(id=scheduler_id)
                        user_type = 'Mentor'
                        user_name = candidate.name
                        user_email = candidate.email
                    except Mentee.DoesNotExist:
                        return JsonResponse({"error": f"Mentee with ID {attendee_id} not found"}, status=404)
        except Mentee.DoesNotExist:
            return JsonResponse({"error": "Mentor not found or has no mentees"}, status=404)
    if type == 1:
        # new meeting 
        subject = 'New meeting Meeting ID: '+ str(meeting.meetingId)+" Title: "+meeting.title
        message = 'New meeting Scheduled by your '+user_type
    if type == 2:
        # Edit meeting 
        subject = 'Meeting Updated Meeting ID: '+ str(meeting.meetingId) + " Title: "+ meeting.title
        message = 'Meeting details for meeting : '+ str(meeting.meetingId) + " updated by user " + user_type
    if type == 3:
        # Delete meeting 
        subject = 'Meeting Deleted Meeting ID: '+ str(meeting.meetingId) + " Title: "+ meeting.title
        message = 'Meeting Removed for meeting : '+ str(meeting.meetingId) + " updated by user " + user_type
    message = message + '\n Schdeduler name : '+user_name
    message = message + '\n Schdeduler email : '+user_email
    message = message + '\n\t Meeting Detials : '
    message = message + '\n\t\t\t Title : ' + meeting.title
    message = message + '\n\t\t\t Date : ' + meeting.date
    message = message + '\n\t\t\t Time : ' + meeting.time
    message = message + '\n\t\t\t Description : ' + meeting.description.replace("\n", "\n\t\t\t\t")
    from_email = settings.EMAIL_HOST_USER
    recipient_list = attendees_list
    send_emails_to(subject, message, from_email, [user_email])
    send_emails_to(subject, message, from_email, recipient_list)

#Done
def send_emails_to(subject, message, from_email, emails):
    invalid_emails = []

    for email in emails:
        try:
            # Validate the email address (add more sophisticated validation if needed)
            validate_email(email)

            # Send email
            send_mail(
                subject,
                message,
                from_email,
                [email],
                fail_silently=False,
            )

        except ValidationError:
            invalid_emails.append({"email": email, "error": "Invalid email address"})
        except Exception as e:
            invalid_emails.append({"email": email, "error": str(e)})


        

    