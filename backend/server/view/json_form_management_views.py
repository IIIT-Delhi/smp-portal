import json
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

# Define the JSON file paths
JSON_FILES = {
    'registration': 'src/data/registrationQuestions.json',
    'consent': 'src/data/consentQuestions.json',
    'feedback': 'src/data/menteeFeedbackQuestions.json',
}

def get_json_file_path(form_type):
    """Get the absolute path to the JSON file for a given form type"""
    if form_type not in JSON_FILES:
        return None
    
    # Get the project root directory (go up from backend/server/view/ to project root)
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    return os.path.join(project_root, JSON_FILES[form_type])

@csrf_exempt
def get_json_form_questions(request, form_type):
    """Get questions from JSON file for a specific form type"""
    if request.method != 'GET':
        return JsonResponse({"error": "Invalid request method"}, status=405)
    
    try:
        file_path = get_json_file_path(form_type)
        if not file_path:
            return JsonResponse({"error": "Invalid form type"}, status=400)
        
        if not os.path.exists(file_path):
            return JsonResponse({"error": "JSON file not found"}, status=404)
        
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            questions = data.get('questions', [])
            return JsonResponse(questions, safe=False)
    
    except Exception as e:
        logger.error(f"Error reading JSON file for {form_type}: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def update_json_form_questions(request, form_type):
    """Update the entire questions array in the JSON file"""
    if request.method != 'PUT':
        return JsonResponse({"error": "Invalid request method"}, status=405)
    
    try:
        file_path = get_json_file_path(form_type)
        if not file_path:
            return JsonResponse({"error": "Invalid form type"}, status=400)
        
        if not os.path.exists(file_path):
            return JsonResponse({"error": "JSON file not found"}, status=404)
        
        # Parse the request body
        data = json.loads(request.body)
        questions = data.get('questions', [])
        
        # Read the existing file
        with open(file_path, 'r', encoding='utf-8') as file:
            existing_data = json.load(file)
        
        # Update the questions
        existing_data['questions'] = questions
        
        # Write back to the file
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(existing_data, file, indent=2, ensure_ascii=False)
        
        return JsonResponse({"message": "Questions updated successfully"})
    
    except Exception as e:
        logger.error(f"Error updating JSON file for {form_type}: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def add_json_form_question(request, form_type):
    """Add a new question to the JSON file"""
    if request.method != 'POST':
        return JsonResponse({"error": "Invalid request method"}, status=405)
    
    try:
        file_path = get_json_file_path(form_type)
        if not file_path:
            return JsonResponse({"error": "Invalid form type"}, status=400)
        
        if not os.path.exists(file_path):
            return JsonResponse({"error": "JSON file not found"}, status=404)
        
        # Parse the request body
        new_question = json.loads(request.body)
        
        # Read the existing file
        with open(file_path, 'r', encoding='utf-8') as file:
            existing_data = json.load(file)
        
        # Add the new question
        if 'questions' not in existing_data:
            existing_data['questions'] = []
        
        # Generate ID if not provided
        if not new_question.get('id'):
            prefix = form_type[:2] if len(form_type) >= 2 else form_type[:1]
            existing_ids = [q.get('id', '') for q in existing_data['questions']]
            counter = 1
            while f"{prefix}q{counter}" in existing_ids:
                counter += 1
            new_question['id'] = f"{prefix}q{counter}"
        
        existing_data['questions'].append(new_question)
        
        # Write back to the file
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(existing_data, file, indent=2, ensure_ascii=False)
        
        return JsonResponse({"message": "Question added successfully", "question": new_question})
    
    except Exception as e:
        logger.error(f"Error adding question to JSON file for {form_type}: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def update_json_form_question(request, form_type, question_id):
    """Update a specific question in the JSON file"""
    if request.method != 'PUT':
        return JsonResponse({"error": "Invalid request method"}, status=405)
    
    try:
        file_path = get_json_file_path(form_type)
        if not file_path:
            return JsonResponse({"error": "Invalid form type"}, status=400)
        
        if not os.path.exists(file_path):
            return JsonResponse({"error": "JSON file not found"}, status=404)
        
        # Parse the request body
        updated_question = json.loads(request.body)
        
        # Read the existing file
        with open(file_path, 'r', encoding='utf-8') as file:
            existing_data = json.load(file)
        
        # Find and update the question
        questions = existing_data.get('questions', [])
        question_found = False
        
        for i, question in enumerate(questions):
            if question.get('id') == question_id:
                questions[i] = updated_question
                question_found = True
                break
        
        if not question_found:
            return JsonResponse({"error": "Question not found"}, status=404)
        
        # Write back to the file
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(existing_data, file, indent=2, ensure_ascii=False)
        
        return JsonResponse({"message": "Question updated successfully"})
    
    except Exception as e:
        logger.error(f"Error updating question in JSON file for {form_type}: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def delete_json_form_question(request, form_type, question_id):
    """Delete a specific question from the JSON file"""
    if request.method != 'DELETE':
        return JsonResponse({"error": "Invalid request method"}, status=405)
    
    try:
        file_path = get_json_file_path(form_type)
        if not file_path:
            return JsonResponse({"error": "Invalid form type"}, status=400)
        
        if not os.path.exists(file_path):
            return JsonResponse({"error": "JSON file not found"}, status=404)
        
        # Read the existing file
        with open(file_path, 'r', encoding='utf-8') as file:
            existing_data = json.load(file)
        
        # Find and remove the question
        questions = existing_data.get('questions', [])
        original_length = len(questions)
        
        questions = [q for q in questions if q.get('id') != question_id]
        
        if len(questions) == original_length:
            return JsonResponse({"error": "Question not found"}, status=404)
        
        existing_data['questions'] = questions
        
        # Write back to the file
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(existing_data, file, indent=2, ensure_ascii=False)
        
        return JsonResponse({"message": "Question deleted successfully"})
    
    except Exception as e:
        logger.error(f"Error deleting question from JSON file for {form_type}: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)
