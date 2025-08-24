import csv
from http.client import HTTPResponse
from io import StringIO
import threading
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from server.view.helper_functions import send_emails_to, get_mail_content
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
        mentor = Candidate.objects.filter(status=5, id=str(data.get('mentorId'))).values()
        if(data.get('imgSrc')):
            new_mentee.imgSrc = data.get('imgSrc')
        else:
            new_mentee.imgSrc = 'data:image/png;base64,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'
        if len(mentor) == 0: 
            new_mentee.save()
            return JsonResponse({"message": "Mentee added but mentor not found, please assign mentor by clicking on \"Change Mentor\""})
        new_mentee.mentorId = mentor[0]['id']
        new_mentee.save()
        return JsonResponse({"message": "Mentee added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})


# @csrf_exempt
# def upload_CSV(request):
#     """
#     Uploads a CSV file, processes the data, and adds Mentee objects to the database.

#     Args:
#         request (object): The HTTP request object containing information about the request.
#             Method: POST
#             Data: CSV file in the 'csvFile' field.

#     Returns:
#         JsonResponse: A JSON response indicating the success or failure of the operation.
#             Example response:
#                 {"message": "//message//"}
#     """
#     if request.method == 'POST':
#         # Check if a file was uploaded
#         if 'csvFile' in request.FILES:
#             uploaded_file = request.FILES['csvFile']
#             file_contents = uploaded_file.read()
#             csv_data = file_contents.decode('iso-8859-1')
#             # Use StringIO to simulate a file-like object for csv.reader
#             csv_io = StringIO(csv_data)
#             # Parse the CSV data
#             csv_reader = csv.reader(csv_io)
#             csv_list = [row for row in csv_reader]
#             # Convert the CSV data to a list of dictionaries
#             header = csv_list[0]
#             csv_data_list = [dict(zip(header, row)) for row in csv_list[1:]]
#             Mentee.objects.all().delete()
#             for item in csv_data_list:
#                 program = item['Program']
#                 branch = item['Branch']

#                 if program == 'B.Tech.':
#                     department = 'B-' + branch
#                 elif program == 'M.Tech.':
#                     department = 'M-' + branch
#                 else:
#                     department = 'Unknown'
#                 mentee = Mentee(
#                     id=item['Roll'],
#                     name=item['Name'],
#                     email=item['Email'],
#                     contact=item['Contact'],
#                     mentorId = '',
#                     department= department
#                 )
#                 if 'Image' in item:
#                     mentee.imgSrc = item["Image"]
#                 else: 
#                     mentee.imgSrc = 'data:image/png;base64,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'
#                 mentee.save()

#             return JsonResponse({'message': 'File uploaded and processed successfully'})
#         else:
#             return JsonResponse({'message': 'No file was uploaded'}, status=400)
#     else:
#         return JsonResponse({'message': 'Unsupported HTTP method'}, status=405)


@csrf_exempt
def upload_CSV(request):
    """
    Uploads a CSV file, processes the data, and appends Mentee objects to the database.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Data: CSV file in the 'csvFile' field.

    Returns:
        JsonResponse: A JSON response indicating the success or failure of the operation.
            Example response:
                {"message": "File uploaded and processed successfully"}
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
            print(csv_data_list)

            for item in csv_data_list:
        
                
                department = item['Department']

                # Old code 
                # program = item['Program']
                # branch = item['Branch']

                # if program == 'B.Tech.':
                #     department = 'B-' + branch
                # elif program == 'M.Tech.':
                #     department = 'M-' + branch
                # else:
                #     department = 'Unknown'

                print(department)

                # Check if mentee already exists
                mentee, created = Mentee.objects.get_or_create(
                    id=item['Roll'],
                    defaults={
                        'name': item['Name'],
                        'email': item['Email'],
                        'contact': item['Contact'],
                        'mentorId': '',
                        'department': department,
                        'imgSrc': item.get('Image', 'data:image/png;base64,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'),
                    }
                )
                # If the mentee already exists, update the necessary fields
                if not created:
                    mentee.name = item['Name']
                    mentee.email = item['Email']
                    mentee.contact = item['Contact']
                    mentee.department = department
                    mentee.imgSrc = item.get('Image', mentee.imgSrc)
                    mentee.save()

            return JsonResponse({"message": "File uploaded and processed successfully"})
        else:
            return JsonResponse({"error": "No file uploaded"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

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
            mentor = Candidate.objects.filter(status=5, id=str(data.get('mentorId'))).values()
            if len(mentor) == 0: 
                return JsonResponse({"message": "Mentor Not Found Make sure that the mentor exist and have same department"})
            existing_mentee.mentorId = mentor[0]['id']
            existing_mentee.save()
            mail_content = get_mail_content("mentor_Assigned")
            thread = threading.Thread(target=send_emails_to, args=(mail_content["subject"], mail_content["body"], settings.EMAIL_HOST_USER,[existing_mentee]))
            thread.start()
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
        mentees = [mentee for mentee in mentees if mentee['department'][0] == 'B']
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
                            'mentorDepartment': mentor[0]['department'],
                            'f3': int(FormStatus.objects.get(formId='3').formStatus)})
            else: 
                mentee.update({'mentorId': 'NULL',
                           'mentorName': 'NULL',
                           'mentorEmail': 'NULL',
                            'mentorContact': 'NULL',
                            'mentorImage': 'NULL',
                            'mentorDepartment': 'NULL',
                            'f3': int(FormStatus.objects.get(formId='3').formStatus)})
        # print(list(mentees))
        return JsonResponse(list(mentees), safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})


def get_all_mtech_mentees(request):
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
        mentees = [mentee for mentee in mentees if mentee['department'][0] == 'M']

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
                            'mentorDepartment': mentor[0]['department'],
                            'f3': int(FormStatus.objects.get(formId='3').formStatus)})
            else: 
                mentee.update({'mentorId': 'NULL',
                           'mentorName': 'NULL',
                           'mentorEmail': 'NULL',
                            'mentorContact': 'NULL',
                            'mentorImage': 'NULL',
                            'mentorDepartment': 'NULL',
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


@csrf_exempt
def check_first_login_status(request):
    """
    Check if a mentee has completed their first login setup.
    
    Args:
        request (object): The HTTP request object.
            Method: POST
            Body (JSON):
                - id (str): Mentee ID.
    
    Returns:
        JsonResponse: A JSON response with first login status.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            mentee_id = data.get('id')
            
            mentee = Mentee.objects.filter(id=mentee_id).first()
            if not mentee:
                return JsonResponse({"error": "Mentee not found"}, status=404)
            
            return JsonResponse({
                "first_login_completed": mentee.first_login_completed,
                "has_photo": bool(mentee.imgSrc and mentee.imgSrc != 'data:image/png;base64,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')
            })
            
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt 
def complete_initial_setup(request):
    """
    Complete the initial setup for a mentee (update contact and photo, mark first login as completed).
    
    Args:
        request (object): The HTTP request object.
            Method: POST
            Body (JSON):
                - id (str): Mentee ID.
                - contact (str, optional): Updated contact number.
                - imgSrc (str, optional): Updated profile image.
    
    Returns:
        JsonResponse: A JSON response indicating success or failure.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            mentee_id = data.get('id')
            
            mentee = Mentee.objects.filter(id=mentee_id).first()
            if not mentee:
                return JsonResponse({"error": "Mentee not found"}, status=404)
            
            # Update contact if provided
            if data.get('contact'):
                mentee.contact = data.get('contact')
            
            # Update image if provided (photo is mandatory)
            if data.get('imgSrc'):
                mentee.imgSrc = data.get('imgSrc')
            else:
                return JsonResponse({"error": "Profile photo is required"}, status=400)
            
            # Mark first login as completed
            mentee.first_login_completed = True
            mentee.save()
            
            return JsonResponse({
                "message": "Initial setup completed successfully",
                "first_login_completed": True
            })
            
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)
