from django.shortcuts import render, HttpResponse
from django.core import serializers
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from .models import *
# Create your views here.
def get_all_admins(request):
    # returns list of json ; [{details},{details},...]
    if request.method == "GET":
        admins = Admin.objects.all()  # Fetch all Admin objects from the database.
        serialized_data = serializers.serialize('json', admins)  # Serialize the queryset to JSON.
        return JsonResponse(serialized_data, safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})

def get_admin_by_id(request):
    # returns list of json with one element; [{details}]
    if request.method == "GET":
        id_to_search = json.loads(request.body.decode('utf-8')).get('id')
        admin = Admin.objects.filter(id=id_to_search)  # Fetch corresponding Admin object
        serialized_data = serializers.serialize('json', admin)  # Serialize the queryset to JSON.
        return JsonResponse(serialized_data, safe=False)
    else:
        return JsonResponse({"message": "Invalid request method"})

def get_all_mentors(request):
    # returns list of json ; [{details}, {details}, ...]
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
    # returns list of json with one element; [{details}]
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
    # returns list of json ; [{details}, {details}, ...]
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
    # returns list of json with one element; [{details}]
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

def delete_all_admins(request):
    # returns json ; {"message": "//message//"}
    if request.method == "GET":
        deleted = Admin.objects.all().delete()
        return JsonResponse({"message": "deleted "+str(deleted[0]+" database entries")})
    else:
        return JsonResponse({"message": "Invalid request method"})

def delete_admin_by_id(request):
    # returns json ; {"message": "//message//"}
    if request.method == "GET":
        id_to_search = json.loads(request.body.decode('utf-8')).get('id')
        deleted = Admin.objects.filter(id=id_to_search).delete()
        return JsonResponse({"message": "deleted "+str(deleted[0]+" database entries")})
    else:
        return JsonResponse({"message": "Invalid request method"})

def delete_all_mentors(request):
    # returns json ; {"message": "//message//"}
    if request.method == "GET":
        deleted = Candidate.objects.filter(status="Approved").delete()
        deleted = Mentor.objects.all().delete()
        return JsonResponse({"message": "deleted "+str(deleted[0]+" database entries")})
    else:
        return JsonResponse({"message": "Invalid request method"})
    
def delete_mentor_by_id(request):
    # returns json ; {"message": "//message//"}
    if request.method == "GET":
        id_to_search = json.loads(request.body.decode('utf-8')).get('id')
        deleted = Candidate.objects.filter(status="Approved", id=id_to_search).delete()
        deleted = Mentor.objects.filter(id=id_to_search).delete()
        return JsonResponse({"message": "deleted "+str(deleted[0]+" database entries")})
    else:
        return JsonResponse({"message": "Invalid request method"})
    
def delete_all_mentees(request):
    # returns json ; {"message": "//message//"}
    if request.method == "GET":
        deleted = Mentee.objects.all().delete()
        return JsonResponse({"message": "deleted "+str(deleted[0]+" database entries")})
    else:
        return JsonResponse({"message": "Invalid request method"})

def delete_mentee_by_id(request):
    # returns json ; {"message": "//message//"}
    if request.method == "GET":
        id_to_search = json.loads(request.body.decode('utf-8')).get('id')
        deleted = Mentee.objects.filter(id=id_to_search).delete()
        return JsonResponse({"message": "deleted "+str(deleted[0]+" database entries")})
    else:
        return JsonResponse({"message": "Invalid request method"})

@csrf_exempt
def add_admin(request):
    # returns json ; {"message": "//message//"}
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        new_admin = Admin(id=data.get('id'), name=data.get('name'), email=data.get('email'),
                          department=data.get('department'), phone=data.get('phone'),
                          address=data.get('address'), imgSrc=data.get('imgSrc'))
        new_admin.save()
        return JsonResponse({"message": "data added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})

@csrf_exempt
def add_mentor(request):
    # returns json ; {"message": "//message//"}
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        new_candidate = Candidate(id=data.get('id'), name=data.get('name'), email=data.get('email'),
                          department=data.get('department'), year=data.get('year'),
                          size=data.get('size'), score=data.get('score'),
                          status="Approved", imgSrc=data.get('imgSrc'))
        new_candidate.save()
        
        new_mentor = Mentor(id=data.get('id'), goodiesStatus=data.get('goodiesStatus'),
                            reimbursement=data.get('reimbursement'))
        new_mentor.save()
        
        for mentee_id in data.get('menteesToMentors'):
            mentee = Mentee.objects.get(id=mentee_id)
            mentee.mentor_id = data.get('id')
            mentee.save()
        
        return JsonResponse({"message": "data added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})

@csrf_exempt
def add_mentee(request):
    # returns json ; {"message": "//message//"}
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        new_mentee = Mentee(id=data.get('id'), name=data.get('name'), email=data.get('email'),
                          department=data.get('department'), imgSrc=data.get('imgSrc'))

        mentor = Candidate.objects.filter(status="Approved", email=data.get('mentorEmail'))
        new_mentee.mentor_id = mentor[0].id
        new_mentee.save()
        return JsonResponse({"message": "data added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})

@csrf_exempt
def edit_admin_by_id(request):
    # returns json ; {"message": "//message//"}
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        admin = Admin.objects.get(id=data.get('id'))
        
        if(data.get('fieldName')=="id"):
            admin.id = data.get('newValue')
        elif(data.get('fieldName')=="name"):
            admin.name = data.get('newValue')
        elif(data.get('fieldName')=="email"):
            admin.email = data.get('newValue')
        elif(data.get('fieldName')=="department"):
            admin.department = data.get('newValue')
        elif(data.get('fieldName')=="phone"):
            admin.phone = data.get('newValue')
        elif(data.get('fieldName')=="address"):
            admin.address = data.get('newValue')
        elif(data.get('fieldName')=="imgSrc"):
            admin.imgSrc = data.get('newValue')

        admin.save()
        return JsonResponse({"message": "data added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})

@csrf_exempt
def edit_mentor_by_id(request):
    # returns json ; {"message": "//message//"}
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        candidate = Candidate.objects.get(id=data.get('id'))
        mentor = Mentor.objects.get(id=data.get('id'))

        if(data.get('fieldName')=="id"):
            candidate.id = data.get('newValue')
            mentor.id = data.get('newValue')
        elif(data.get('fieldName')=="name"):
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
        elif(data.get('fieldName')=="goodiesStatus"):
            mentor.goodiesStatus = data.get('newValue')
        elif(data.get('fieldName')=="reimbursement"):
            mentor.reimbursement = data.get('newValue')
        elif(data.get('fieldName')=="menteesToMentors"):
            for mentee_id in data.get('newValue'):
                mentee = Mentee.objects.get(id=mentee_id)
                mentee.mentor_id = data.get('id')

        candidate.save()
        mentor.save()
        return JsonResponse({"message": "data added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})

@csrf_exempt
def edit_mentee_by_id(request):
    # returns json ; {"message": "//message//"}
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        mentee = Mentee.objects.get(id=data.get('id'))

        if(data.get('fieldName')=="id"):
            mentee.id = data.get('newValue')
        elif(data.get('fieldName')=="name"):
            mentee.name = data.get('newValue')
        elif(data.get('fieldName')=="email"):
            mentee.email = data.get('newValue')
        elif(data.get('fieldName')=="department"):
            mentee.department = data.get('newValue')
        elif(data.get('fieldName')=="imgSrc"):
            mentee.imgSrc = data.get('newValue')
        elif(data.get('fieldName')=="mentorId"):
            mentee.mentor_id = data.get('newValue')            

        mentee.save()
        return JsonResponse({"message": "data added successfully"})
    else:
        return JsonResponse({"message": "Invalid request method"})

def index(request):
    return HttpResponse("home")