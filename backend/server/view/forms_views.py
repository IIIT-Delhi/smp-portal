from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from server.models import *
from django.conf import settings
import threading
from server.view.helper_functions import send_emails_to, get_mail_content


@csrf_exempt
def get_form_status(request):
    """
    Retrieves the status of forms.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST

    Returns:
        JsonResponse: A JSON response containing the status of forms.
            Example response: [{"id": 1, "status": "Approved"}, {"id": 2, "status": "Pending"}]

            Possible response:
                - {"message": "Invalid request method"} (status 400): If the request method is not POST.
    """
    if request.method == "POST":
        form = FormStatus.objects.all().values()
        return JsonResponse(list(form), safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"}, status=400)


@csrf_exempt
def update_form_status(request):
    """
    Updates the status of a specific form and triggers email notifications based on the form status.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Body (JSON):
                - formStatus (int): Updated status of the form (e.g., 0 for Pending, 1 for Approved, etc.).
                - formId (int): ID of the form to be updated.

    Returns:
        JsonResponse: A JSON response indicating the success or failure of the form status update.
            Possible responses:
                - {"message": "Form status updated successfully"}: If the form status is successfully updated.
                - {"error": "Invalid request method"} (status 400): If the request method is not POST.
    """
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        formStatus = data.get('formStatus')
        formId=data.get("formId")
        form = FormStatus.objects.get(formId=formId)
        form.formStatus = formStatus
        form.save()
        emails = []
        # if int(formId) == 2 and int(formStatus) == 0:
        #     candidates_with_status_2 = Candidate.objects.filter(status=2).values("email")
        #     emails = [candidate['email'] for candidate in candidates_with_status_2]
        #     Candidate.objects.filter(status=2).update(status=1) 
        if int(formId) == 3 and int(formStatus) == 1:
            mentee_list = Mentee.objects.filter().values("email")
            emails = [candidate['email'] for candidate in mentee_list]
            mail_content = get_mail_content("feedback_open")
            thread = threading.Thread(target=send_emails_to, args=(mail_content["subject"], mail_content["body"], settings.EMAIL_HOST_USER, emails))
            thread.start()
        elif int(formId) == 3 and int(formStatus) == 0:
            mentee_list = Mentee.objects.filter().values("email")
            emails = [candidate['email'] for candidate in mentee_list]
            mail_content = get_mail_content("feedback_close")
            thread = threading.Thread(target=send_emails_to, args=(mail_content["subject"], mail_content["body"], settings.EMAIL_HOST_USER, emails))
            thread.start()
        return JsonResponse({"message": "Form status updated successfully"})
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def get_form_response(request):
    """
    Retrieves the responses submitted for a specific form type.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Body (JSON):
                - formType (int): Type of the form for which responses are to be retrieved.

    Returns:
        JsonResponse: A JSON response containing the form responses.
            Example response: 
            {
                "formResponses": [
                    {
                        "submitterId": 1,
                        "submiterName": "John Doe",
                        "responses": {"question1": "answer1", "question2": "answer2"},
                        "department": "Computer Science",
                        "submitterEmail": "john@example.com",
                        "Year": 3,
                        "Contact": "1234567890",
                        "Image": "image_url",
                        "consent_status": 0,
                        "mapping_status": 1
                    },
                    ...
                ]
            }

            Possible responses:
                - {"error": "FormResponses not found for the given formType"} (status 404):
                  If there are no form responses for the provided form type.
                - {"error": "Invalid request method"} (status 400): If the request method is not POST.
    """
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
                if int(form_type) == 3:
                    if len(Mentee.objects.filter(id=form_response_obj['submitterId']).values()):
                        summiter_name = Mentee.objects.filter(id=form_response_obj['submitterId']).values()[0]['name']
                        department = Mentee.objects.filter(id=form_response_obj['submitterId']).values()[0]['department']
                form_response_obj['responses'].pop('mentorId')
                form_response_obj['responses'].pop('mentorName')
                response_data = {
                    "submitterId": form_response_obj['submitterId'],
                    "responses": form_response_obj['responses'],
                }

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
                        response_data["submitterName"] = mentee_obj.name
                        response_data["submitterEmail"] = mentee_obj.email
                        response_data["Contact"] = mentee_obj.contact
                        response_data["department"] = mentee_obj.department
                        mentor_obj = Candidate.objects.get(id=mentee_obj.mentorId)
                        response_data["mentorId"] = mentor_obj.id
                        response_data["mentorName"] = mentor_obj.name
                        response_data["mentorEmail"] = mentor_obj.email
                        response_data["mentorYear"] = mentor_obj.year
                        response_data["mentorDepartment"] = mentor_obj.department
                        
                    
                    form_responses_data.append(response_data)

            print({"formResponses": form_responses_data})
            return JsonResponse({"formResponses": form_responses_data})

        except FormResponses.DoesNotExist:
            return JsonResponse({"error": "FormResponses not found for the given formType"}, status=404)
        
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def submit_consent_form(request):
    """
    Submits the consent form and updates the candidate's information and status accordingly.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Body (JSON):
                - id (int): ID of the candidate submitting the consent form.
                - cq1 to cq11 (int): Responses to consent questions, with values 0 or 1.
                - imgSrc (str): Image source for the candidate.
                - size (int): Size information for the candidate.

    Returns:
        JsonResponse: A JSON response indicating the success or failure of the consent form submission.
            Possible responses:
                - {"message": "Consent form submitted successfully"}: If the consent form is successfully submitted.
                - {"message": "Invalid request method"}: If the request method is not POST.
    """
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
        
        mail_content = get_mail_content("consent_filled")
        thread = threading.Thread(target=send_emails_to, args=(mail_content["subject"], mail_content["body"], settings.EMAIL_HOST_USER,[candidate.email]))
        thread.start()
        
        return JsonResponse({"message": "Consent form submitted successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})


@csrf_exempt
def mentee_filled_feedback(request):
    """
    Submits the feedback form filled by a mentee.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Body (JSON):
                - id (int): ID of the mentee submitting the feedback form.
                - mentorId (int): ID of the mentor associated with the feedback.
                - mentorName (str): Name of the mentor.
                - fq1 (int): Response to feedback question 1.
                - fq2 (int): Response to feedback question 2.
                - fq3 (int): Response to feedback question 3.
                - fq4 (int): Response to feedback question 4.

    Returns:
        JsonResponse: A JSON response indicating the success or failure of the feedback form submission.
            Possible responses:
                - {"message": "Feedback form submitted successfully"}: If the feedback form is successfully submitted.
                - {"message": "Invalid request method"}: If the request method is not POST.
    """
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
        mentee = Mentee.objects.get(id=data.get('id'))
        new_responses.save()
        mail_content = get_mail_content("feedback_filled")
        thread = threading.Thread(target=send_emails_to, args=(mail_content["subject"], mail_content["body"], settings.EMAIL_HOST_USER,[mentee.email]))
        thread.start()
        return JsonResponse({"message": "Feedback form submitted successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})


@csrf_exempt
def send_consent_form(request):
    """
    Sends consent forms to candidates and updates their status.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Body (JSON):
                - subject (str): Subject of the email.
                - body (str): Body content of the email.
                - Id (list): List of candidate IDs to whom the consent forms should be sent.

    Returns:
        JsonResponse: A JSON response indicating the success or failure of sending consent forms.
            Possible responses:
                - {"message": "Mail sent successfully"}: If the consent forms are successfully sent.
                - {"error": "Missing required data"} (status 400): If required data is missing in the request.
                - {"error": "Invalid request method"} (status 400): If the request method is not POST.
    """
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

