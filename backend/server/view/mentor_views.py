from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from server.models import *
from django.conf import settings
from server.view.helper_functions import send_emails_to, get_mail_content
import threading


@csrf_exempt
def add_candidate(request):
    """
    Add a new candidate along with their responses to the questionnaire.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            JSON data: {
                "id": "//candidate_id//",
                "name": "//candidate_name//",
                "email": "//candidate_email//",
                "department": "//candidate_department//",
                "year": "//candidate_year//",
                "contact": "//candidate_contact//",
                "score": "//calculated_score//",
                "imgSrc": "//image_source//",
                "rq1": "//response_to_question_1//",
                "rq2": "//response_to_question_2//",
                "rq3": "//response_to_question_3//",
                "rq4": "//response_to_question_4//",
                "rq5": "//response_to_question_5//",
                "rq6": "//response_to_question_6//"
            }

    Returns:
        JsonResponse: A JSON response indicating the success or failure of the operation.
            Example response:
                {"message": "//success_message//"}
    """
    if request.method == "POST":
        # Parse the request body as JSON
        data = json.loads(request.body.decode('utf-8'))
        responses = {
            'rq1': data.get('rq1'),
            'rq2': data.get('rq2'),
            'rq3': data.get('rq3'),
            'rq4': data.get('rq4'),
            'rq5': data.get('rq5'),
            'rq6': data.get('rq6'),
        }

        # Define scoring rules for each response question
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
        new_candidate = Candidate(id = data.get('id'), name = data.get('name'), email = data.get('email'),
                          department = data.get('department'), year = data.get('year'), contact = data.get('contact'),
                          score = score, status = 1)
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

        # Send an email notification to the candidate using a separate thread
        mail_content = get_mail_content("registration")
        thread = threading.Thread(target=send_emails_to, args=(mail_content["subject"], mail_content["body"], settings.EMAIL_HOST_USER, [new_candidate.email]))
        thread.start()
        
        return JsonResponse({"message": "data added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})


@csrf_exempt
def add_mentor(request):
    """
    Add a new mentor.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            JSON data: {
                "id": "//mentor_id//",
                "name": "//mentor_name//",
                "email": "//mentor_email//",
                "department": "//mentor_department//",
                "year": "//mentor_year//",
                "size": "//mentor_size//",
                "score": "//mentor_score//",
                "contact": "//mentor_contact//",
                "imgSrc": "//mentor_image_source//",
                "menteesToMentors": ["//mentee_id_1//", "//mentee_id_2//", ...]
            }

    Returns:
        JsonResponse: A JSON response indicating the success or failure of the operation.
            Example response:
                {"message": "//success_message//"}
    """
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        new_candidate = Candidate(id=data.get('id'), name=data.get('name'), email=data.get('email'),
                          department=data.get('department'), year=data.get('year'),
                          size=data.get('size'), score=data.get('score'),contact=data.get('contact'),
                          status=5, imgSrc=data.get('imgSrc'))
        new_candidate.save()
        
        for mentee_id in data.get('menteesToMentors'):
            mentee = Mentee.objects.get(id=mentee_id)
            mentee.mentorId = data.get('id')
            mentee.save()
        
        return JsonResponse({"message": "data added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})

@csrf_exempt
def edit_mentor_by_id(request):
    """
    Edit mentor details by ID.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            JSON data: {
                "id": "//mentor_id//",
                "fieldName": "//field_name//",
                "newValue": "//new_value//"
            }

    Returns:
        JsonResponse: A JSON response indicating the success or failure of the operation.
            Example response:
                {"message": "//success_message//"}
    """
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        candidate = Candidate.objects.get(id=data.get('id'))

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
        elif(data.get('fieldName')=="menteesToMentors"):
            for mentee_id in data.get('newValue'):
                mentee = Mentee.objects.get(id=mentee_id)
                mentee.mentorId = data.get('id')

        candidate.save()
        return JsonResponse({"message": "data added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})


def get_all_mentors(request):
    """
    Get details of all mentors.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: GET

    Returns:
        JsonResponse: A JSON response containing details of all mentors.
            Example response:
                [
                    {"id": "//mentor_id1//", "name": "//mentor_name1//", "menteesToMentors": [...], ...},
                    {"id": "//mentor_id2//", "name": "//mentor_name2//", "menteesToMentors": [...], ...},
                    ...
                ]
    """
    if request.method == "GET":
        mentors_from_candidates = Candidate.objects.filter(status=5).values()
        for mentor in mentors_from_candidates:
            # adding menteesToMentors list
            menteesToMentors = []
            mentees = Mentee.objects.filter(mentorId=str(mentor.id)).values()
            
            for mentee in mentees:
                menteesToMentors.append([mentee['id'], mentee['name'], mentee['email'], mentee['contact']])
            mentor.update({'menteesToMentors': menteesToMentors})
        return JsonResponse(list(mentors_from_candidates), safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})

@csrf_exempt 
def get_mentor_by_id(request):
    """
    Get mentor details by ID.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Body: JSON object with 'id' attribute specifying the mentor ID to search.

    Returns:
        JsonResponse: A JSON response containing mentor details.
            Example response:
                {"id": "//mentor_id//", "name": "//mentor_name//", ...}
    """
    if request.method == "POST":
        id_to_search = json.loads(request.body.decode('utf-8')).get('id')
        mentor = Candidate.objects.filter(status=5, id=id_to_search).values()
        # adding menteesToMentors list
        menteesToMentors = []
        mentees = Mentee.objects.filter(mentorId=str(id_to_search)).values()
        for mentee in mentees:
            menteesToMentors.append([mentee['id'], mentee['name'], mentee['email'], mentee['contact']])
        mentor[0].update({'menteesToMentors': menteesToMentors})
        return JsonResponse(mentor[0], safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})


def delete_all_mentors(request):
    """
    Deletes all mentors with status=5.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: GET

    Returns:
        JsonResponse: A JSON response indicating the success or failure of the operation.
            Example response:
                {"message": "//message//"}
    """
    if request.method == "GET":
        deleted = Candidate.objects.filter(status=5).delete()
        return JsonResponse({"message": "deleted "+str(deleted[0])+" database entries"})
    else:
        return JsonResponse({"message": "Invalid request method"})


@csrf_exempt
def delete_mentor_by_id(request):
    """
    Deletes a mentor by ID and replaces them with the mentor having the highest score in the same department.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Data: JSON object with the 'id' field containing the mentor ID to be deleted.

    Returns:
        JsonResponse: A JSON response indicating the success or failure of the operation.
            Example response:
                {"message": "//message//"}
    """
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
            candidate = Candidate.objects.get(id=mentor_id)
            candidate.status = -1
            candidate.save()
            highest_score_mentor_id = highest_score_mentor["id"]
            candidate_new = Candidate.objects.get(id=highest_score_mentor_id)
            candidate_new.status = 5
            candidate_new.save()
            return JsonResponse({"message": f"Repalced Mentor ID: {highest_score_mentor_id}"})
        except Candidate.DoesNotExist:
            return JsonResponse({"message": "Mentor not found"})
    else:
        return JsonResponse({"message": "No new mentor to replace"})