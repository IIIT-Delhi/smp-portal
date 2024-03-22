from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from server.models import *

@csrf_exempt 
def get_id_by_email(request) -> JsonResponse:
    """
    User Auth API: Retrieves user information based on their email and role.
    
    Args:
        request (HttpRequest): The HTTP request object containing the request method and body.
        
    Returns:
        JsonResponse: The user information as a JSON response.
    """
    if request.method == "POST":
        # Extract email and role from the request body
        data = json.loads(request.body.decode('utf-8'))
        email = data.get('email')
        role = data.get('role')

        try:
            if not email or not role:
                return JsonResponse({'error': 'Invalid email or role'})
            
            if role == "admin":
                entry = Admin.objects.filter(email=email).values()
            elif role == "mentor":
                if Mentee.objects.filter(email=email).values():
                    data_dict = {
                        'id': -2,
                    }
                    return JsonResponse(data_dict)
                entry = Candidate.objects.filter(email=email).values()
            elif role == "mentee":
                entry = Mentee.objects.filter(email=email).values()
                
                for mentee in entry:
                    # Retrieve additional details about the mentor
                    mentor_id_to_search = mentee['mentorId']
                    mentor = Candidate.objects.filter(id=mentor_id_to_search).values()
                    
                    if mentor:      # mentor assigned retrive mentor details 
                        mentor = mentor[0]
                        mentee.update({
                            'mentorId': mentor['id'],
                            'mentorName': mentor['name'],
                            'mentorEmail': mentor['email'],
                            'mentorContact': mentor['contact'],
                            'mentorImage': mentor['imgSrc'],
                            'f3': int(FormStatus.objects.get(formId='3').formStatus)
                        })
                    else:       # else put NULL
                        mentee.update({
                            'mentorId': 'NULL',
                            'mentorName': 'NULL',
                            'mentorEmail': 'NULL',
                            'mentorContact': 'NULL',
                            'mentorImage': 'NULL',
                            'f3': int(FormStatus.objects.get(formId='3').formStatus)
                        })
            
            if len(entry) == 0:
                data_dict = {
                    'id': -1,
                    'f1': str(FormStatus.objects.get(formId='1').formStatus),
                    'f2': str(FormStatus.objects.get(formId='2').formStatus)
                }
                return JsonResponse(data_dict)
            return JsonResponse(entry[0])
        
        except Exception as e:
            data_dict = {'id': -1}
            return JsonResponse(data_dict)
    
    else:
        # Handle other request methods
        pass
        return JsonResponse({"message": "Invalid request method"})
    


    