from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from server.models import *
from django.conf import settings
import threading
from server.view.helper_functions import send_emails_to, get_mail_content

@csrf_exempt
def get_excellence_award(request):
    """
    Retrieves the list of candidates who are eligible for the excellence award.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST

    Returns:
        JsonResponse: A JSON response containing the list of candidates eligible for the excellence award.
            Example response: 
                [
                    {
                        "id": 1,
                        "name": "John Doe",
                        "email": "john@gmail.com",
                        "department": "Computer Science",
                        "year": 3,
                        "contact": "1234567890",
                        "score": 1,
                    }
                ]
                

            Possible responses:
                - {"error": "No candidates found"} (status 404): If no candidates are eligible for the excellence award.
                - {"error": "Invalid request method"} (status 400): If the request method is not POST.
    """
    if request.method == "POST":
        # try:
        eligible_candidates = Candidate.objects.filter(status=5)
        excellence_award_data = []
        max_meetings_attended = 0
        max_meetings_scheduled = 0
        for candidate in eligible_candidates:
            # Calculate the number of meetings attended by the candidate
            meetings_attended = Attendance.objects.filter(attendeeId=candidate.id).count()
            # Calculate the number of meetings scheduled by the candidate
            meetings_scheduled = Meetings.objects.filter(schedulerId=candidate.id).count()
            # Retrieve feedback forms submitted by the mentees of the candidate's mentor
            mentee_feedback_forms = FormResponses.objects.filter(FormType='3').filter(responses__mentorId=candidate.id)
            # Additional metrics calculation (e.g., average mentor rating)
            total_ratings = 0
            total_mentees = 0
            max_meetings_attended = max(max_meetings_attended, meetings_attended)
            max_meetings_scheduled = max(max_meetings_scheduled, meetings_scheduled)
            maping = {"Pathetic":-2, "Bad":-1, "No Comments":0, "Good":1, "Excellent":2}
            for form in mentee_feedback_forms:
                total_ratings += int(maping[form.responses['fq4']])  # Assuming fq4 contains mentor rating
                total_mentees += 1
        
            average_mentor_rating = total_ratings / total_mentees if total_mentees != 0 else 0
            excellence_award_data.append({
                'candidate_id': candidate.id,
                "name": candidate.name,
                "email": candidate.email,
                "department": candidate.department,
                "year": candidate.year,
                "contact": candidate.contact,
                'meetings_attended': meetings_attended,
                'meetings_scheduled': meetings_scheduled,
                'average_mentor_rating': average_mentor_rating,
            })

        candidate_list = []
        for candidate in excellence_award_data:
            m = candidate['meetings_attended']/max_meetings_attended*3.0 if max_meetings_attended != 0 else 0
            n = candidate['meetings_scheduled']/max_meetings_scheduled*3.0 if max_meetings_scheduled != 0 else 0
            score = m + n + int(candidate['average_mentor_rating'])
            candidate_info = {
                "id": candidate["candidate_id"],
                "name": candidate['name'],
                "email": candidate['email'],
                "department": candidate['department'],
                "year": candidate['year'],
                "contact": candidate['contact'],
                "score": score,
            }
            
            try:
                excellence_award_data = ExcellenceAward.objects.get(candidateId=candidate["candidate_id"])
                candidate_info["status"] = 1  # Attendee is present
            except ExcellenceAward.DoesNotExist:
                candidate_info["status"] = 0  # Attendee is absent
            candidate_list.append(candidate_info)
        return JsonResponse({"candidateList": candidate_list})
        # except Exception as e:
        #     return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)
    
@csrf_exempt
def update_excellence_award(request):
    """
    Updates the excellence award status for a candidate.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Body: {
                'candidateList': [
                    {
                    "candidate_id": 1,
                    "status": 1
                    }
                ]
            }

    Returns:
        JsonResponse: A JSON response containing a success message if the operation is successful.
            Example response: {"message": "Excellence award status updated successfully"}

            Possible responses:
                - {"error": "Candidate not found"} (status 404): If the candidate with the provided ID is not found.
                - {"error": "Invalid request method"} (status 400): If the request method is not POST.
    """
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        candidate_list = data.get('candidateList', [])
        try:
            candidate_info = []
            for candidate in candidate_list:
                candidate_id = candidate.get('id')
                status = candidate.get('status')
                if status == 1:
                    try:
                        excellence_award_data = ExcellenceAward.objects.get(candidateId=candidate_id)
                    except ExcellenceAward.DoesNotExist:
                        excellanceAward = ExcellenceAward(candidateId=candidate_id)
                        excellanceAward.save()
                        candidate_s = Candidate.objects.get(id=candidate_id)
                        candidate_info.append(candidate_s.email)
                    # Send an email to the candidate
            mail_content = get_mail_content('excellence_award')
            thread = threading.Thread(target=send_emails_to, args=(mail_content["subject"], mail_content["body"], settings.EMAIL_HOST_USER,candidate_list))
            thread.start()
            return JsonResponse({"message": "Excellence award status updated successfully"})
        except Candidate.DoesNotExist:
            return JsonResponse({"error": "Candidate not found"}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)