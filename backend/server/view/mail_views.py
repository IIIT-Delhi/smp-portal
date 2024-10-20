from django.http import JsonResponse
import json
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
