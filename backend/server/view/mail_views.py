from django.http import JsonResponse
import json
import os
import re
from django.views.decorators.csrf import csrf_exempt
from server.models import *
from server.MailContent import mail_content


@csrf_exempt
def get_mail_subject_and_body(request):
    """
    Retrieves the email subject and body based on the specified type.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Body (JSON):
                - type (str): Type of email content to retrieve.

    Returns:
        JsonResponse: A JSON response containing the email subject and body.
            Possible responses:
                - {"subject": "Email Subject", "body": "Email Body"}: If the type is found.
                - {"message": "Type not found in MailContent"} (status 404): If the type is not found.
                - {"message": "Invalid request method"} (status 400): If the request method is not POST.
    """
    if request.method == "POST":
        requested_type = json.loads(request.body.decode('utf-8')).get('type')
        for entry in mail_content:
            if entry.get('type') == requested_type:
                subject = entry.get('subject')
                body = entry.get('body')
                return JsonResponse({"subject": subject, "body": body})

        # If no match found
        return JsonResponse({"message": "Type not found in MailContent"}, status=404)
    else:
        return JsonResponse({"message": "Invalid request method"}, status=400)


@csrf_exempt
def update_mail_content(request):
    """
    Updates the email subject and body in the MailContent.py file.

    Args:
        request (object): The HTTP request object containing information about the request.
            Method: POST
            Body (JSON):
                - type (str): Type of email content to update.
                - subject (str): New subject for the email.
                - body (str): New body for the email.

    Returns:
        JsonResponse: A JSON response indicating success or failure.
            Possible responses:
                - {"message": "Mail content updated successfully"}: If the update is successful.
                - {"message": "Type not found in MailContent"} (status 404): If the type is not found.
                - {"message": "Invalid request method"} (status 400): If the request method is not POST.
                - {"message": "Error updating mail content: {error}"} (status 500): If there's an error updating the file.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            requested_type = data.get('type')
            new_subject = data.get('subject')
            new_body = data.get('body')
            
            # Validate input
            if not requested_type or new_subject is None or new_body is None:
                return JsonResponse({"message": "Missing required fields: type, subject, body"}, status=400)
            
            # Check if type exists in mail_content
            type_found = False
            for entry in mail_content:
                if entry.get('type') == requested_type:
                    type_found = True
                    break
            
            if not type_found:
                return JsonResponse({"message": "Type not found in MailContent"}, status=404)
            
            # Update the MailContent.py file
            success = _update_mail_content_file(requested_type, new_subject, new_body)
            
            if success:
                return JsonResponse({"message": "Mail content updated successfully"})
            else:
                return JsonResponse({"message": "Error updating mail content file"}, status=500)
                
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format"}, status=400)
        except Exception as e:
            return JsonResponse({"message": f"Error updating mail content: {str(e)}"}, status=500)
    else:
        return JsonResponse({"message": "Invalid request method"}, status=400)


def _update_mail_content_file(email_type, new_subject, new_body):
    """
    Helper function to update the MailContent.py file with new subject and body.
    
    Args:
        email_type (str): The type of email to update
        new_subject (str): The new subject
        new_body (str): The new body
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Get the path to MailContent.py
        current_dir = os.path.dirname(os.path.abspath(__file__))
        mail_content_path = os.path.join(os.path.dirname(current_dir), 'MailContent.py')
        
        # Read the current file
        with open(mail_content_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Create a pattern to match the specific email type entry
        # This pattern matches the entire dictionary entry for the given type
        pattern = r'(\s*{\s*"type"\s*:\s*"' + re.escape(email_type) + r'".*?})'
        
        # Find the entry to replace
        match = re.search(pattern, content, re.DOTALL)
        if not match:
            return False
        
        # Create the new entry with properly escaped strings
        new_entry = f'''    {{
        "type" : "{email_type}",
        "subject" : "{_escape_string_for_python(new_subject)}",
        "body" : "{_escape_string_for_python(new_body)}"
    }}'''
        
        # Replace the old entry with the new one
        updated_content = content[:match.start(1)] + new_entry + content[match.end(1):]
        
        # Write the updated content back to the file
        with open(mail_content_path, 'w', encoding='utf-8') as file:
            file.write(updated_content)
        
        return True
        
    except Exception as e:
        print(f"Error updating mail content file: {str(e)}")
        return False


def _escape_string_for_python(text):
    """
    Helper function to properly escape strings for Python code.
    
    Args:
        text (str): The text to escape
        
    Returns:
        str: The escaped text
    """
    # Escape backslashes first
    text = text.replace('\\', '\\\\')
    # Escape double quotes
    text = text.replace('"', '\\"')
    # Escape newlines
    text = text.replace('\n', '\\n')
    # Escape carriage returns
    text = text.replace('\r', '\\r')
    # Escape tabs
    text = text.replace('\t', '\\t')
    
    return text
