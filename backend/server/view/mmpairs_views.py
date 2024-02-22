import math
import random
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from server.models import *
from django.conf import settings
import threading
from server.view.helper_functions import get_mail_content, send_emails_to


@csrf_exempt
def create_mentor_mentee_pairs(request):
    """
    Creates mentor-mentee pairs and sends emails to the mentors.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Body (JSON):
                - subject (str): Subject of the email.
                - body (str): Body content of the email.
                - Id (list): List of candidate IDs.

    Returns:
        JsonResponse: A JSON response indicating the success or failure of creating pairs and sending emails.
            Possible responses:
                - {"message": "Missing required data"} (status 400): If required data is missing in the request.
                - {"message": "Mail sent successfully"}: If pairs are created and emails are sent successfully.
                - {"error": "Invalid request method"} (status 400): If the request method is not POST.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            subject = data.get('subject')
            message = data.get('body')
            candidate_ids = data.get('Id', [])

            if not all([subject, message, candidate_ids]):
                return JsonResponse({"error": "Please Select Students"}, status=400)

            departments = Mentee.objects.values_list('department', flat=True).distinct()
            department_dict = {department: [] for department in departments}

            emails_mentor = []
            emails_mentees = []
            for candidate_id in candidate_ids:
                candidate = Candidate.objects.get(id=candidate_id)
                candidate.status = '5'
                department_dict[candidate.department].append(candidate)
                candidate.save()
                emails_mentor.append(candidate.email)

            for department in departments:
                mentees = Mentee.objects.filter(department=department, mentorId='')
                candidates = department_dict[department]
                candidates_dict = {candidate.id: 0 for candidate in candidates}
                if len(candidates_dict) == 0: 
                    continue
                mentee_batch_size = math.ceil(len(mentees) / len(candidates_dict))
                for mentee in mentees:
                    candidate_id = random.choice([key for key, value in candidates_dict.items() if value < mentee_batch_size])
                    mentee.mentorId = candidate_id
                    emails_mentees.append(mentee.email)
                    mentee.save()
                    candidates_dict[candidate_id] += 1
                
                for candidate in candidates:
                    candidate.status = '5'
                    candidate.save()

            thread = threading.Thread(target=send_emails_to, args=(subject, message, settings.EMAIL_HOST_USER, emails_mentor))
            thread.start()
            mail_content = get_mail_content("mentor_Assigned")
            thread = threading.Thread(target=send_emails_to, args=(mail_content["subject"], mail_content["body"], settings.EMAIL_HOST_USER,emails_mentees))
            thread.start()

            return JsonResponse({'message': "Mail sent successfully"})
        except Exception as e:
            print(e)
            return JsonResponse({'message': str(e)})
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

