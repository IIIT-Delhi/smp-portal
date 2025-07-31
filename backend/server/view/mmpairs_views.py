import math
import random
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from server.models import *
from django.conf import settings
import threading
from server.view.helper_functions import get_mail_content, send_emails_to, schedule_department_wise_emails


def infer_gender_from_name(name):
    """
    Simple gender inference based on common name patterns.
    This is a basic implementation and may not be 100% accurate.
    In a production system, you might want to use a more sophisticated approach.
    """
    if not name:
        return 'unknown'
    
    # Convert to lowercase for comparison
    name_lower = name.lower().strip()
    
    # Common male name patterns/endings
    male_patterns = [
        'raj', 'kumar', 'singh', 'dev', 'deep', 'pal', 'mohan', 'ram', 'krishna',
        'aditya', 'arjun', 'rohit', 'amit', 'sumit', 'vikash', 'vikas', 'ashish',
        'rahul', 'ravi', 'suresh', 'mahesh', 'ganesh', 'karan', 'harsh', 'nitin'
    ]
    
    # Common female name patterns/endings
    female_patterns = [
        'priya', 'rani', 'devi', 'kumari', 'sita', 'gita', 'rita', 'anita',
        'sunita', 'kavita', 'asha', 'usha', 'rupa', 'suman', 'pooja', 'neha',
        'sneha', 'meera', 'deepika', 'ankita', 'nikita', 'shweta', 'sweta'
    ]
    
    # Check for male patterns
    for pattern in male_patterns:
        if pattern in name_lower:
            return 'male'
    
    # Check for female patterns
    for pattern in female_patterns:
        if pattern in name_lower:
            return 'female'
    
    # If no pattern matches, return unknown (will be treated as mixed)
    return 'unknown'


@csrf_exempt
def create_mentor_mentee_pairs(request):
    """
    Creates mentor-mentee pairs and sends emails to the mentors.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Body (JSON):
                - subject (str): Subject of the email.
                - body (str): Body content of the email.
                - Id (list): List of candidate IDs.

    Returns:
        JsonResponse: A JSON response indicating the success or failure of creating pairs and sending emails.
            Possible responses:
                - {"message": "Missing required data"} (status 400): If required data is missing in the request.
                - {"message": "Mail sent successfully"}: If pairs are created and emails are sent successfully.
                - {"error": "Invalid request method"} (status 400): If the request method is not POST.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            subject = data.get('subject')
            message = data.get('body')
            candidate_ids = data.get('Id', [])

            if not all([subject, message, candidate_ids]):
                return JsonResponse({"error": "Please Select Students"}, status=400)

            departments = Mentee.objects.values_list('department', flat=True).distinct()
            department_dict = {department: [] for department in departments}

            emails_mentor = []
            emails_mentees = []
            for candidate_id in candidate_ids:
                candidate = Candidate.objects.get(id=candidate_id)
                if candidate.department not in departments:
                    continue
                department_dict[candidate.department].append(candidate)
                emails_mentor.append(candidate.email)

            for department in departments:
                mentees = Mentee.objects.filter(department=department, mentorId='')
                candidates = department_dict[department]
                candidates_dict = {candidate.id: 0 for candidate in candidates}
                if len(candidates_dict) == 0: 
                    continue
                
                # Enhanced pairing with gender consideration
                mentee_batch_size = min(6, math.ceil(len(mentees) / len(candidates_dict)))
                
                # Separate mentees and candidates by gender (if gender field exists)
                male_mentees = []
                female_mentees = []
                male_candidates = []
                female_candidates = []
                
                for mentee in mentees:
                    # Try to infer gender from name or use explicit gender field if available
                    gender = infer_gender_from_name(mentee.name)
                    if gender == 'male':
                        male_mentees.append(mentee)
                    else:
                        female_mentees.append(mentee)
                
                for candidate in candidates:
                    gender = infer_gender_from_name(candidate.name)
                    if gender == 'male':
                        male_candidates.append(candidate)
                    else:
                        female_candidates.append(candidate)
                
                # Assign mentees trying to maintain gender balance
                assigned_mentees = []
                
                # First, try to assign same-gender pairs when possible
                for male_mentee in male_mentees:
                    if male_candidates:
                        # Find male candidate with least mentees
                        available_male_candidates = [c for c in male_candidates if candidates_dict[c.id] < mentee_batch_size]
                        if available_male_candidates:
                            candidate = min(available_male_candidates, key=lambda c: candidates_dict[c.id])
                            male_mentee.mentorId = candidate.id
                            emails_mentees.append(male_mentee.email)
                            male_mentee.save()
                            candidates_dict[candidate.id] += 1
                            assigned_mentees.append(male_mentee)
                
                for female_mentee in female_mentees:
                    if female_candidates:
                        # Find female candidate with least mentees
                        available_female_candidates = [c for c in female_candidates if candidates_dict[c.id] < mentee_batch_size]
                        if available_female_candidates:
                            candidate = min(available_female_candidates, key=lambda c: candidates_dict[c.id])
                            female_mentee.mentorId = candidate.id
                            emails_mentees.append(female_mentee.email)
                            female_mentee.save()
                            candidates_dict[candidate.id] += 1
                            assigned_mentees.append(female_mentee)
                
                # Assign remaining mentees to any available candidates
                remaining_mentees = [m for m in mentees if m not in assigned_mentees]
                for mentee in remaining_mentees:
                    available_candidates = [c for c in candidates if candidates_dict[c.id] < mentee_batch_size]
                    if available_candidates:
                        candidate = min(available_candidates, key=lambda c: candidates_dict[c.id])
                        mentee.mentorId = candidate.id
                        emails_mentees.append(mentee.email)
                        mentee.save()
                        candidates_dict[candidate.id] += 1
                
                for candidate in candidates:
                    candidate.status = '5'
                    candidate.save()

            # Use department-wise email scheduling instead of immediate sending
            mentor_emails = []
            mentee_emails = []
            
            for candidate_id in candidate_ids:
                candidate = Candidate.objects.get(id=candidate_id)
                mentor_emails.append(candidate.email)
            
            for email in emails_mentees:
                mentee_emails.append(email)

            # Schedule mentor emails department-wise
            mentor_schedule_summary = schedule_department_wise_emails(
                subject=subject,
                body=message,
                email_list=mentor_emails,
                schedule_type='mentor_mapping'
            )
            
            # Schedule mentee emails department-wise  
            mail_content = get_mail_content("mentor_Assigned")
            mentee_schedule_summary = schedule_department_wise_emails(
                subject=mail_content["subject"],
                body=mail_content["body"],
                email_list=mentee_emails,
                schedule_type='mentor_mapping'
            )

            return JsonResponse({
                'message': "Mentor-Mentee mapping completed and emails scheduled department-wise",
                'mentor_email_schedule': mentor_schedule_summary,
                'mentee_email_schedule': mentee_schedule_summary
            })
        except Exception as e:
            print(e)
            return JsonResponse({'message': str(e)})
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

