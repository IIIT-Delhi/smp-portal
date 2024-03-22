from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from server.models import *


 
@csrf_exempt
def get_attendance(request):
    """
    Retrieves the attendance details for a given meeting based on the meeting ID.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Body (JSON):
                - meetingId (int): ID of the meeting for which attendance details are to be retrieved.

    Returns:
        JsonResponse: A JSON response containing attendance details for mentors and/or mentees in the meeting.
            Possible responses:
                - {"error": "Meeting not found"} (status 404): If the meeting with the provided ID is not found.
                - {"error": "Invalid request method"} (status 400): If the request method is not POST.
                - {"error": "Mentor not found or has no mentees"} (status 404): If the mentor is not found or has no mentees.
                - {"error": "Mentee with ID {attendee_id} not found"} (status 404): If a mentee with a specific ID is not found.
                - {"attendees": [{"id": 1, "name": "John Doe", "email": "john@example.com", "attendance": 1}, ...]}: 
                  If attendance details are successfully retrieved. Attendance value 1 indicates present, 0 indicates absent.
    """
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
                mentors = Candidate.objects.filter(status=5, department__in=meeting.mentorBranches).values()
                for mentor in mentors:
                    attendee_info = {}
                    attendee_info["id"] = mentor['id']
                    attendee_info["name"] = mentor['name']
                    attendee_info["email"] = mentor['email']
                    try:
                        attendance = Attendance.objects.get(attendeeId=mentor['id'], meetingId=meeting_id)
                        attendee_info["attendance"] = 1  # Attendee is present
                    except Attendance.DoesNotExist:
                        attendee_info["attendance"] = 0  # Attendee is absent
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
                mentors = Candidate.objects.filter(status=5, department__in=meeting.mentorBranches).values()
                for mentor in mentors:
                    attendee_info = {}
                    attendee_info["id"] = mentor['id']
                    attendee_info["name"] = mentor['name']
                    attendee_info["email"] = mentor['email']
                    try:
                        attendance = Attendance.objects.get(attendeeId=mentor['id'], meetingId=meeting_id)
                        attendee_info["attendance"] = 1  # Attendee is present
                    except Attendance.DoesNotExist:
                        attendee_info["attendance"] = 0  # Attendee is absent
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
                menteeList = []
                for menteelist in meeting.menteeList:
                    menteeList.append(menteelist['id'])
                mentor_mentees = Mentee.objects.filter(mentorId=scheduler_id,
                                                       id__in=menteeList).values()
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

        return JsonResponse({"attendees": attendees_list})

    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def update_attendance(request):
    """
    Updates the attendance for multiple attendees in a specific meeting.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Body (JSON):
                - meetingId (int): ID of the meeting for which attendance is to be updated.
                - attendees (list): List of dictionaries, each containing:
                    - id (int): ID of the attendee (mentor or mentee).
                    - attendance (int): Attendance value (0 for absent, 1 for present).

    Returns:
        JsonResponse: A JSON response indicating the success or failure of the attendance update.
            Possible responses:
                - {"message": "Attendance updated successfully"}: If the attendance is successfully updated.
                - {"error": "Invalid request method"} (status 400): If the request method is not POST.
    """
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
        return JsonResponse({"error": "Invalid request method"}, status=400)
