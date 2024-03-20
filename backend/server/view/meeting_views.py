from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from server.models import *
from datetime import datetime
import threading
from server.view.helper_functions import send_emails_to_attendees

@csrf_exempt
def add_meeting(request):
    """
    Adds a new meeting based on the provided data.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Body (JSON):
                - schedulerId (str): ID of the scheduler.
                - date (str): Date of the meeting.
                - time (str): Time of the meeting.
                - title (str): Title of the meeting.
                - attendee (list): List of attendees ("Mentors", "Mentees", or both).
                - description (str): Description of the meeting.
                - mentorBranches (list, optional): List of mentor branches.
                - menteeBranches (list, optional): List of mentee branches.
                - menteeList (list, optional): List of mentee IDs.

    Returns:
        JsonResponse: A JSON response indicating the success or failure of adding a meeting.
            Possible responses:
                - {"error": "Meeting already scheduled at the same date and time"}: If a meeting with the same scheduler_id, date, and time already exists.
                - {"message": "Data added successfully"}: If the meeting is added successfully.
                - {"error": "Invalid request method"} (status 400): If the request method is not POST.
    """
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        scheduler_id = data.get('schedulerId')
        date = data.get('date')
        time = data.get('time')
        attendeelist = data.get('attendee')
        attendeevalue = -1
        mentorBranches = data.get('mentorBranches', [])
        menteeBranches = data.get('menteeBranches', [])
        menteeList = data.get('menteeList', [])
        mentee_names = Mentee.objects.filter(id__in=menteeList).values_list('id', 'name')
        menteeList =  [{'id': id, 'name': name} for id, name in mentee_names]

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
            return JsonResponse({"error": "Meeting already scheduled at the same date and time"}, status=400)
        else:
            new_meeting = Meetings(
                title=data.get('title'),
                schedulerId=scheduler_id,
                date=date,
                time=time,
                attendee=attendeevalue,
                description=data.get('description'),
                mentorBranches=mentorBranches, 
                menteeBranches = menteeBranches,
                menteeList = menteeList,
            )
            new_meeting.save()
            thread = threading.Thread(target=send_emails_to_attendees, args=(new_meeting, 1))
            thread.start()
            return JsonResponse({"message": "Data added successfully"})
    else:
        return JsonResponse({"error": "Invalid request method"})


@csrf_exempt
def edit_meeting_by_id(request):
    """
    Edits an existing meeting based on the provided data.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Body (JSON):
                - meetingId (int): ID of the meeting to be edited.
                - title (str): New title of the meeting.
                - schedulerId (str): New scheduler ID.
                - date (str): New date of the meeting.
                - time (str): New time of the meeting.
                - attendee (list): List of attendees ("Mentors", "Mentees", or both).
                - description (str): New description of the meeting.
                - mentorBranches (list, optional): List of new mentor branches.
                - menteeBranches (list, optional): List of new mentee branches.
                - menteeList (list, optional): List of new mentee IDs.

    Returns:
        JsonResponse: A JSON response indicating the success or failure of editing a meeting.
            Possible responses:
                - {"message": "Meeting already scheduled at the same date and time"}: If a meeting with the same scheduler_id, date, and time already exists.
                - {"message": "Data added successfully"}: If the meeting is edited successfully.
                - {"message": "Invalid request method"}: If the request method is not POST.
    """
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
        meeting.menteeBranches = data.get('menteeBranches', [])
        meeting.menteeList = data.get('menteeList', [])
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
    
@csrf_exempt
def delete_meeting_by_id(request):
    """
    Deletes a meeting based on the provided meeting ID.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Body (JSON):
                - meetingId (int): ID of the meeting to be deleted.

    Returns:
        JsonResponse: A JSON response indicating the success or failure of deleting a meeting.
            Possible responses:
                - {"message": "deleted X database entries"}: If the meeting is deleted successfully (X is the number of entries deleted).
                - {"message": "Invalid request method"}: If the request method is not POST.
    """
    if request.method == "POST":
        id_to_search = json.loads(request.body.decode('utf-8')).get('meetingId')
        meeting = Meetings.objects.get(meetingId=id_to_search)
        thread = threading.Thread(target=send_emails_to_attendees, args=(meeting, 3))
        thread.start()
        deleted = Meetings.objects.filter(meetingId=id_to_search).delete()
        return JsonResponse({"message": "deleted "+str(deleted[0])+" database entries"})
    else:
        return JsonResponse({"message": "Invalid request method"})


@csrf_exempt
def get_meetings(request):
    """
    Retrieves meetings based on user type and ID.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Body (JSON):
                - role (str): User type (admin, mentor, mentee).
                - id (int): User ID.

    Returns:
        JsonResponse: A JSON response containing categorized meetings.
            Example response:
                {
                    "previousMeeting": [...],
                    "upcomingMeeting": [...]
                }
    """
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
            try:
                mentee_department = Mentee.objects.get(id=user_id).department
            except Mentee.DoesNotExist:
                return JsonResponse({"error": "Mentee not found"})
            
            # Return meetings organized by the mentee's mentor and meetings where the mentee is an attendee
            mentor = Mentee.objects.get(id=user_id).mentorId
            mentor_meetings = Meetings.objects.filter(schedulerId=mentor, 
                    menteeList__contains=[user_id]).values()
            attendee_meetings = Meetings.objects.filter(attendee__in=[2, 3],
                menteeBranches__contains=[mentee_department]).values()  # Include 2 (mentee) and 3 (both mentor and mentee)
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
            try:
                meeting_date = datetime.strptime(f"{meeting['date']} {meeting['time']}", '%Y-%m-%d %H:%M')
                if meeting_date < current_datetime:
                    previous_meetings.append(meeting)
                elif meeting_date > current_datetime:
                    upcoming_meetings.append(meeting)
            except ValueError:
                continue

        meetings_data = {
            "previousMeeting":  previous_meetings,
            "upcomingMeeting": upcoming_meetings
        }
        return JsonResponse(meetings_data)
    else:
        return JsonResponse({"message": "Invalid request method"})
   