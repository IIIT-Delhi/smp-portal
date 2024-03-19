import csv
from http.client import HTTPResponse
from io import StringIO
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from server.models import *


@csrf_exempt
def add_mentee(request):
    """
    Adds a new mentee based on the provided data.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Body (JSON):
                - id (str): Mentee ID.
                - name (str): Mentee name.
                - email (str): Mentee email.
                - department (str): Mentee department.
                - mentorId (str): ID of the mentor to whom the mentee is assigned.
                - imgSrc (str, optional): Image source for the mentee.

    Returns:
        JsonResponse: A JSON response indicating the success or failure of adding a mentee.
            Possible responses:
                - {"message": "Mentee with this ID already exist"}: If a mentee with the given ID already exists.
                - {"message": "Mentor Not Found"}: If the specified mentor is not found.
                - {"message": "Mentee added successfully"}: If the mentee is added successfully.
                - {"message": "Invalid request method"} (status 400): If the request method is not POST.
    """
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        existing_mentee = Mentee.objects.filter(id=data.get('id')).first()
        if existing_mentee:
            return JsonResponse({"message": "Mentee with this ID already exist"})
        new_mentee = Mentee(id=data.get('id'), name=data.get('name'), email=data.get('email'),
                          department=data.get('department'), contact=data.get('contact'))
        mentor = Candidate.objects.filter(status=5, id=str(data.get('mentorId')), department=str(data.get('department'))).values()
        if(data.get('imgSrc')):
            new_mentee.imgSrc = data.get('imgSrc')
        if len(mentor) == 0: 
            return JsonResponse({"message": "Mentor Not Found"})
        new_mentee.mentorId = mentor[0]['id']
        new_mentee.save()
        return JsonResponse({"message": "Mentee added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})


@csrf_exempt
def upload_CSV(request):
    """
    Uploads a CSV file, processes the data, and adds Mentee objects to the database.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Data: CSV file in the 'csvFile' field.

    Returns:
        JsonResponse: A JSON response indicating the success or failure of the operation.
            Example response:
                {"message": "//message//"}
    """
    if request.method == 'POST':
        # Check if a file was uploaded
        if 'csvFile' in request.FILES:
            uploaded_file = request.FILES['csvFile']
            file_contents = uploaded_file.read()
            csv_data = file_contents.decode('iso-8859-1')
            # Use StringIO to simulate a file-like object for csv.reader
            csv_io = StringIO(csv_data)
            # Parse the CSV data
            csv_reader = csv.reader(csv_io)
            csv_list = [row for row in csv_reader]
            # Convert the CSV data to a list of dictionaries
            header = csv_list[0]
            csv_data_list = [dict(zip(header, row)) for row in csv_list[1:]]
            Mentee.objects.all().delete()
            for item in csv_data_list:
                program = item['Program']
                branch = item['Branch']

                if program == 'B.Tech.':
                    department = 'B-' + branch
                elif program == 'M.Tech.':
                    department = 'M-' + branch
                else:
                    department = 'Unknown'
                mentee = Mentee(
                    id=item['Roll'],
                    name=item['Name'],
                    email=item['Email'],
                    contact=item['Contact'],
                    mentorId = '',
                    department= department
                )
                if 'Image' in item:
                    mentee.imgSrc = item["Image"]
                mentee.save()

            return JsonResponse({'message': 'File uploaded and processed successfully'})
        else:
            return JsonResponse({'message': 'No file was uploaded'}, status=400)
    else:
        return JsonResponse({'message': 'Unsupported HTTP method'}, status=405)


@csrf_exempt
def edit_mentee_by_id(request):
    """
    Edits the details of a mentee based on the provided data.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Data: JSON data containing the details to be edited.

    Returns:
        JsonResponse: A JSON response indicating the success or failure of the operation.
            Example response:
                {"message": "//message//"}
    """
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        existing_mentee = Mentee.objects.filter(id=data.get('id')).first()
        if existing_mentee:
            mentor = Candidate.objects.filter(status=5, id=str(data.get('mentorId')), department=str(data.get('department'))).values()
            if len(mentor) == 0: 
                return JsonResponse({"message": "Mentor Not Found Make sure that the mentor exist and have same department"})
            existing_mentee.mentorId = mentor[0]['id']
            existing_mentee.save()
            return JsonResponse({"message": "Mentee Details Updated successfully"})
        else: 
            return JsonResponse({"message": "No such mentee Exist"})
    
    else:
        return JsonResponse({"message": "Invalid request method"})


def get_all_mentees(request):
    """
    Retrieves details of all mentees.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: GET

    Returns:
        JsonResponse: A JSON response containing the details of all mentees.
            Example response:
                [{"id": "mentee_id1", "name": "mentee_name1", "email": "mentee_email1", ...},
                 {"id": "mentee_id2", "name": "mentee_name2", "email": "mentee_email2", ...}, ...]
    """
    if request.method == "GET":
        mentees = Mentee.objects.all().values()
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


def get_mentee_by_id(request):
    """
    Retrieves details of a mentee by their ID.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: GET
            Parameters:
                - id: The ID of the mentee.

    Returns:
        JsonResponse: A JSON response containing the details of the mentee.
            Example response:
                [{"id": "mentee_id", "name": "mentee_name", "email": "mentee_email", ...}]
    """
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


def delete_all_mentees(request):
    """
    Deletes all mentees from the database.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: GET

    Returns:
        JsonResponse: A JSON response indicating the result of the deletion.
            Example response:
                {"message": "deleted //number// database entries"}
    """
    if request.method == "GET":
        deleted = Mentee.objects.all().delete()
        return JsonResponse({"message": "deleted "+str(deleted[0])+" database entries"})
    else:
        return JsonResponse({"message": "Invalid request method"})


@csrf_exempt
def delete_mentee_by_id(request):
    """
    Deletes a mentee by ID.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Body (JSON):
                - id (str): Mentee ID to be deleted.

    Returns:
        JsonResponse: A JSON response indicating the result of the deletion.
            Example response:
                {"message": "deleted //number// database entries"}
    """
    if request.method == "POST":
        id_to_search = json.loads(request.body.decode()).get('id')
        deleted = Mentee.objects.filter(id=str(id_to_search)).delete()
        return JsonResponse({"message": "deleted "+str(deleted[0])+" database entries"})
    else:
        return JsonResponse({"message": "Invalid request method"})
