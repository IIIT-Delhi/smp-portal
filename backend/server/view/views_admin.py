from io import StringIO
import math
import os
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
from .MailContent import mail_content


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
                    'f1': str(FormStatus.objects.get(formId='1').formStatus),
                    'f2': str(FormStatus.objects.get(formId='2').formStatus)
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