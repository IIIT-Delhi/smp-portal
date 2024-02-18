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
def create_mentor_mentee_pairs(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            subject = data.get('subject')
            message = data.get('body')
            candidate_ids = data.get('Id', [])

            if not all([subject, message, candidate_ids]):
                return JsonResponse({"error": "Missing required data"}, status=400)

            departments = Mentee.objects.values_list('department', flat=True).distinct()
            department_dict = {department: [] for department in departments}

            emails = []
            for candidate_id in candidate_ids:
                candidate = Candidate.objects.get(id=candidate_id)
                candidate.status = '5'
                department_dict[candidate.department].append(candidate)
                candidate.save()
                emails.append(candidate.email)

            for department in departments:
                mentees = Mentee.objects.filter(department=department, mentorId='')
                candidates = department_dict[department]
                candidates_dict = {candidate.id: 0 for candidate in candidates}
                if len(candidates_dict) == 0: 
                    continue
                print("here 4")
                mentee_batch_size = math.ceil(len(mentees) / len(candidates_dict))
                for mentee in mentees:
                    candidate_id = random.choice([key for key, value in candidates_dict.items() if value < mentee_batch_size])
                    mentee.mentorId = candidate_id
                    mentee.save()
                    candidates_dict[candidate_id] += 1
                
                for candidate in candidates:
                    candidate.status = 5
                    candidate.save()

            thread = threading.Thread(target=send_emails_to, args=(subject, message, settings.EMAIL_HOST_USER, emails))
            thread.start()

            return JsonResponse({'message': "Mail sent successfully"})
        except Exception as e:
            print(e)
            return JsonResponse({'message': str(e)})
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

