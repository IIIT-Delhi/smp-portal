from io import StringIO
import math
import os
import random
from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from server.models import *
import csv
from datetime import datetime
from django.db import transaction
from django.core.mail import send_mail
from django.conf import settings
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
import threading
from .MailContent import mail_content



@csrf_exempt
def get_mail_subject_and_body(request):
    if request.method == "POST":
        requested_type = json.loads(request.body.decode('utf-8')).get('type')
        for entry in mail_content:
            if entry.get('type') == requested_type:
                subject = entry.get('subject')
                body = entry.get('body')
                print({"subject": subject, "body": body})
                return JsonResponse({"subject": subject, "body": body})

        # If no match found
        return JsonResponse({"message": "Type not found in MailContent"}, status=404)
    else:
        return JsonResponse({"message": "Invalid request method"}, status=400)
