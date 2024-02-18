from io import StringIO
import math
import os
import random
from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from server.models import *
import csv
from datetime import datetime
from django.db import transaction
from django.core.mail import send_mail
from django.conf import settings
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
import threading
from .MailContent import mail_content


 
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
                mentees = Mentee.objects.filter(department__in=meeting.menteeBranches).values()
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

                mentees = Mentee.objects.filter(department__in=meeting.menteeBranches).values()
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
                mentor_mentees = Mentee.objects.filter(mentorId=scheduler_id,
                                                       id__in=meeting.menteeList).values()
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
        # print({"attendees": attendees_list})
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
