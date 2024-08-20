from django.http import JsonResponse
from server.models import *
from django.core.mail import send_mail
from django.conf import settings
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from server.MailContent import mail_content

def send_emails_to_attendees(meeting, type):
    """
    Sends emails to meeting attendees based on the meeting type.

    Args:
        meeting (object): The meeting object containing information about the meeting.
        type (int): Type of the meeting (1: new meeting, 2: meeting edited, 3: deleted).

    Returns:
        None
    """

    """
    1: new meeting
    2: meeting edited
    3: deleted 
    """
    scheduler_id = meeting.schedulerId
    attendees_list = []
    attendees = meeting.attendee
    user_type = ''
    user_name = ''
    user_email = ''

    try:
        admin = Admin.objects.get(id=scheduler_id)
        user_type = 'Admin'
        user_name = admin.name
        user_email = admin.email
        if attendees == 1:  # Mentor
            # Filter mentors based on mentorBranches
            mentors = Candidate.objects.filter(department__in=meeting.mentorBranches, status=5).values()
            for mentor in mentors:
                attendees_list.append(mentor['email'])

        elif attendees == 2:  # Mentee
            mentees = Mentee.objects.filter(department__in=meeting.menteeBranches).values()
            for mentee in mentees:
                attendees_list.append(mentee['email'])

        elif attendees == 3:  # Both mentor and mentee
            # Filter mentors based on mentorBranches
            mentors = Candidate.objects.filter(department__in=meeting.mentorBranches,status=5).values()
            for mentor in mentors:
                attendees_list.append(mentor['email'])

            mentees = Mentee.objects.filter(department__in=meeting.menteeBranches).values()
            for mentee in mentees:
                attendees_list.append(mentee['email'])
                   
    except Admin.DoesNotExist:
        # Mentor scheduler, get all mentees of the mentor
        try:
            mentor_mentees = Mentee.objects.filter(mentorId=scheduler_id,
                                                       id__in=meeting.menteeList).values()
            attendees = [mentee['id'] for mentee in mentor_mentees]
            for attendee_id in attendees:
                    attendee_info = {}
                    try:
                        mentee = Mentee.objects.get(id=attendee_id)
                        attendees_list.append(mentee.email)
                        candidate = Candidate.objects.get(id=scheduler_id)
                        user_type = 'Mentor'
                        user_name = candidate.name
                        user_email = candidate.email
                    except Mentee.DoesNotExist:
                        return JsonResponse({"error": f"Mentee with ID {attendee_id} not found"}, status=404)
        except Mentee.DoesNotExist:
            return JsonResponse({"error": "Mentor not found or has no mentees"}, status=404)
    if type == 1:
        # new meeting 
        subject = 'New meeting: Title: '+meeting.title
        message = 'New meeting Scheduled by: '+user_type
    if type == 2:
        # Edit meeting 
        subject = 'Meeting Updated: Title: '+ meeting.title
        message = 'Meeting details with meeting ID : '+ str(meeting.meetingId) + " updated by user " + user_type
    if type == 3:
        # Delete meeting 
        subject = 'Meeting Deleted: Title: '+ meeting.title
        message = 'Meeting Removed with meeting ID : '+ str(meeting.meetingId) + " updated by user " + user_type
    message = message + '\n Schdeduler name : '+user_name
    message = message + '\n Schdeduler email : '+user_email
    message = message + '\n\t Meeting Detials : '
    message = message + '\n\t\t\t Title : ' + meeting.title
    message = message + '\n\t\t\t Date : ' + meeting.date
    message = message + '\n\t\t\t Time : ' + meeting.time
    message = message + '\n\t\t\t Description : ' + meeting.description.replace("\n", "\n\t\t\t\t")
    from_email = settings.EMAIL_HOST_USER
    recipient_list = attendees_list
    send_emails_to(subject, message, from_email, [user_email])
    send_emails_to(subject, message, from_email, recipient_list)

#Done
def send_emails_to(subject, message, from_email, emails):
    """
    Sends emails to the specified list of email addresses.

    Args:
        subject (str): Subject of the email.
        message (str): Body content of the email.
        from_email (str): Sender's email address.
        emails (list): List of email addresses to which the emails should be sent.

    Returns:
        None
    """
    invalid_emails = []

    for email in emails:
        try:
            validate_email(email)
            # Send email
            send_mail(
                subject,
                message,
                from_email,
                [email],
                fail_silently=False,
            )

        except ValidationError:
            invalid_emails.append({"email": email, "error": "Invalid email address"})
        except Exception as e:
            invalid_emails.append({"email": email, "error": str(e)})
    

def get_mail_content(type):
    """
    Retrieves the content for email based on the specified type.

    Args:
        type (str): Type of email content to retrieve.

    Returns:
        dict or None: A dictionary containing email subject and body, or None if the type is not found.
    """
    for entry in mail_content:
        if entry.get('type') == type:
            subject = entry.get('subject')
            body = entry.get('body')
            return {"subject": subject, "body": body}
    return None