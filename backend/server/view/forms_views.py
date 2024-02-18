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
        subject = ""
        message = ""
        emails = []
        if int(formId) == 2 and int(formStatus) == 0:
            candidates_with_status_2 = Candidate.objects.filter(status=2).values("email")
            emails = [candidate['email'] for candidate in candidates_with_status_2]
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
                if int(form_type) == 1 or int(form_type) == 2:
                    if len(Candidate.objects.filter(id=form_response_obj['submitterId']).values()):
                        summiter_name = Candidate.objects.filter(id=form_response_obj['submitterId']).values()[0]['name']
                        department = Candidate.objects.filter(id=form_response_obj['submitterId']).values()[0]['department']
                        status = Candidate.objects.filter(id=form_response_obj['submitterId']).values()[0]['status']
                if int(form_type) == 3:
                    if len(Mentee.objects.filter(id=form_response_obj['submitterId']).values()):
                        summiter_name = Mentee.objects.filter(id=form_response_obj['submitterId']).values()[0]['name']
                        department = Mentee.objects.filter(id=form_response_obj['submitterId']).values()[0]['department']
                response_data = {
                    "submitterId": form_response_obj['submitterId'],
                    "submiterName": summiter_name,
                    "responses": form_response_obj['responses'],
                    "department": department,
                }

                consent_status = None
                mapping_status = None
                if int(status) == 1:
                    consent_status = 0
                elif int(status) == 2:
                    consent_status = 1
                elif int(status) == 3:
                    mapping_status = 0
                elif int(status) == 5:
                    mapping_status = 1

                if summiter_name != '':
                    if int(form_type) in [1, 2]:
                        mentor_obj = Candidate.objects.get(id=form_response_obj['submitterId'])
                        response_data["submitterName"] = mentor_obj.name
                        response_data["submitterEmail"] = mentor_obj.email
                        response_data["Year"] = mentor_obj.year
                        response_data["Contact"] = mentor_obj.contact
                        response_data["Image"] = mentor_obj.imgSrc
                        response_data["consent_status"] = consent_status
                        response_data["mapping_status"] = mapping_status

                    elif int(form_type) == 3:
                        mentee_obj = Mentee.objects.get(id=form_response_obj['submitterId'])
                        response_data["MenteeName"] = mentee_obj.name
                        response_data["MenteeEmail"] = mentee_obj.email
                        response_data["Contact"] = mentee_obj.contact
                    
                # response_data.update(form_response_obj['responses'])
                    form_responses_data.append(response_data)

            print({"formResponses": form_responses_data})
            return JsonResponse({"formResponses": form_responses_data})

        except FormResponses.DoesNotExist:
            return JsonResponse({"error": "FormResponses not found for the given formType"}, status=404)
        
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)



@csrf_exempt
def submit_consent_form(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        user_id = data.get('id')
        cq_responses = {
            f'cq{i}': data.get(f'cq{i}', 0) for i in range(1, 12)
        }
        correct_options = sum(value == 1 for value in cq_responses.values())
        if correct_options == 0:
            cq_responses["score"] = correct_options
        else:
            cq_responses["score"] = 1
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
        else:
            Candidate.objects.filter(id=user_id).update(status=4)
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

@csrf_exempt
def send_consent_form(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            subject = data.get('subject')
            message = data.get('body')
            candidate_ids = data.get('Id', [])

            if not all([subject, message, candidate_ids]):
                return JsonResponse({"error": "Missing required data"}, status=400)

            emails = []
            for candidate_id in candidate_ids:
                candidate = Candidate.objects.get(id=candidate_id)
                candidate.status = '2'
                candidate.save()
                emails.append(candidate.email)

            thread = threading.Thread(target=send_emails_to, args=(subject, message, settings.EMAIL_HOST_USER, emails))
            thread.start()

            return JsonResponse({'message': "Mail sent successfully"})
        except Exception as e:
            print(e)
            return JsonResponse({'message': str(e)})
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

