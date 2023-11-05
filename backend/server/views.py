from django.shortcuts import render, HttpResponse
from django.core import serializers
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from .models import *
# Create your views here.
# @csrf_exempt
# def trying(request):
#     print("got the data from react")
#     if request.method == "POST":
#         data = json.loads(request.body.decode('utf-8'))
#         desc = data.get('desc')
#         if(desc):
#     #         data_obj = Data(desc=desc)
#     #         data_obj.save()
#     #         print("Saved successfully")
#     #         return JsonResponse({"message": "Data saved successfully"})
#     #     else:
#     #         return JsonResponse({"message": "Invalid data"})
#     # else:
#     #     return JsonResponse({"message": "Invalid request method"})
#             data_objects = Data.objects.filter(desc=desc)
#             if data_objects.exists():
#                 data_objects.delete()
#                 return JsonResponse({"message": f"Data with desc '{desc}' deleted successfully"})
#             else:
#                 return JsonResponse({"message": f"No data with desc '{desc}' found"})
#         else:
#             return JsonResponse({"message": "Invalid data"})
#     else:
#         return JsonResponse({"message": "Invalid request method"})

def get_all_admins(request):
    # returns list of json ; {{details},{details},...}
    if request.method == "GET":
        admins = Admin.objects.all()  # Fetch all Admin objects from the database.
        serialized_data = serializers.serialize('json', admins)  # Serialize the queryset to JSON.
        return JsonResponse(serialized_data, safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})

def get_admin_by_id(request):
    # returns list of json with one element; {{details}}
    if request.method == "GET":
        id_to_search = json.loads(request.body.decode('utf-8')).get('id')
        admin = Admin.objects.filter(id=id_to_search)  # Fetch corresponding Admin object
        serialized_data = serializers.serialize('json', admin)  # Serialize the queryset to JSON.
        return JsonResponse(serialized_data, safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})

def get_all_mentors(request):
    # returns list of json ; {{details}, {details}, ...}
    if request.method == "GET":
        mentors_from_candidates = Candidate.objects.filter(status="Approved").values()
        for mentor in mentors_from_candidates:
            # adding other 'goodiesStatus' and 'reimbursement' details
            id_to_search = mentor['id']
            other_details = Mentor.objects.filter(id=id_to_search).values()
            mentor.update({'goodiesStatus': other_details[0]['goodiesStatus'],
                           'reimbursement': other_details[0]['reimbursement']})
            
            # adding menteesToMentors list
            menteesToMentors = []
            mentees = Mentee.objects.filter(mentor=id_to_search).values()
            for mentee in mentees:
                menteesToMentors.append(mentee['id'])
            mentor.update({'menteesToMentors': menteesToMentors})
            
            # removing unnecessary details
            mentor.pop("status")
        serialized_data = serializers.serialize('json', mentors_from_candidates)
        return JsonResponse(serialized_data, safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})
    
def get_mentor_by_id(request):
    # returns list of json with one element; {{details}}
    if request.method == "GET":
        id_to_search = json.loads(request.body.decode('utf-8')).get('id')
        mentor = Candidate.objects.filter(status="Approved", id=id_to_search).values()

        # adding 'goodiesStatus' and 'reimbursement' details
        other_details = Mentor.objects.filter(id=id_to_search).values()
        mentor[0].update({'goodiesStatus': other_details[0]['goodiesStatus'],
                        'reimbursement': other_details[0]['reimbursement']})
        
        # adding menteesToMentors list
        menteesToMentors = []
        mentees = Mentee.objects.filter(mentor_id=id_to_search).values()
        for mentee in mentees:
            menteesToMentors.append(mentee['id'])
        mentor[0].update({'menteesToMentors': menteesToMentors})
        
        # removing unnecessary details
        mentor[0].pop("status")
        serialized_data = serializers.serialize('json', mentor)
        return JsonResponse(serialized_data, safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})
    
def get_all_mentees(request):
    # returns list of json ; {{details}, {details}, ...}
    if request.method == "GET":
        mentees = Mentee.objects.all().values()
        for mentee in mentees:
            # adding other 'mentorName' and 'mentorEmail' details
            mentor_id_to_search = mentee['mentor_id']
            mentor = Mentor.objects.filter(id=mentor_id_to_search).values()
            mentee.update({'mentorName': mentor[0]['name'],
                           'mentorEmail': mentor[0]['email']})
            # removing unnecessary details
            mentee.pop("mentor_id")
        serialized_data = serializers.serialize('json', mentees)
        return JsonResponse(serialized_data, safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})

def get_mentee_by_id(request):
    # returns list of json with one element; {{details}}
    if request.method == "GET":
        id_to_search = json.loads(request.body.decode('utf-8')).get('id')
        mentees = Mentee.objects.filter(id=id_to_search).values()
        for mentee in mentees:
            # adding other 'mentorName' and 'mentorEmail' details
            mentor_id_to_search = mentee['mentor_id']
            mentor = Mentor.objects.filter(id=mentor_id_to_search).values()
            mentee.update({'mentorName': mentor[0]['name'],
                           'mentorEmail': mentor[0]['email']})
            # removing unnecessary details
            mentee.pop("mentor_id")
        serialized_data = serializers.serialize('json', mentees)
        return JsonResponse(serialized_data, safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})

def index(request):
    return HttpResponse("home")