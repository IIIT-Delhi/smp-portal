from django.http import JsonResponse
from server.models import *
from django.core.mail import send_mail
from django.conf import settings
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from server.MailContent import mail_content
from datetime import date, timedelta
import threading
from django.utils import timezone

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


def schedule_department_wise_emails(subject, body, email_list, schedule_type='general', start_date=None):
    """
    Schedule emails department-wise to respect SMTP daily limits.
    
    Args:
        subject (str): Email subject
        body (str): Email body
        email_list (list): List of email addresses with their associated departments
        schedule_type (str): Type of email (mentor_mapping, consent, general)
        start_date (date): Starting date for scheduling (defaults to today)
    
    Returns:
        dict: Summary of scheduled emails by department
    """
    if start_date is None:
        start_date = date.today()
    
    # Group emails by department
    department_emails = {}
    
    # Get department information for each email
    for email in email_list:
        # Try to find department from Candidate (mentors) first
        try:
            candidate = Candidate.objects.get(email=email)
            dept = candidate.department
        except Candidate.DoesNotExist:
            # Try to find department from Mentee
            try:
                mentee = Mentee.objects.get(email=email)
                dept = mentee.department
            except Mentee.DoesNotExist:
                # Default department if not found
                dept = 'UNKNOWN'
        
        if dept not in department_emails:
            department_emails[dept] = []
        department_emails[dept].append(email)
    
    # Schedule emails for each department on different days
    scheduled_summary = {}
    current_date = start_date
    
    # Get unique departments and sort them for consistent scheduling
    departments = sorted(department_emails.keys())
    
    for i, department in enumerate(departments):
        emails = department_emails[department]
        
        # Schedule this department's emails for current_date
        email_schedule = EmailSchedule.objects.create(
            schedule_type=schedule_type,
            subject=subject,
            body=body,
            department=department,
            recipient_emails=emails,
            scheduled_date=current_date,
            status='pending'
        )
        
        scheduled_summary[department] = {
            'email_count': len(emails),
            'scheduled_date': current_date.strftime('%Y-%m-%d'),
            'schedule_id': email_schedule.id
        }
        
        # Move to next day for next department
        current_date += timedelta(days=1)
    
    return scheduled_summary


def send_scheduled_emails():
    """
    Send emails that are scheduled for today.
    This function should be called by a daily cron job or scheduler.
    
    Returns:
        dict: Summary of sent emails
    """
    today = date.today()
    pending_schedules = EmailSchedule.objects.filter(
        scheduled_date=today,
        status='pending'
    )
    
    sent_summary = {}
    
    for schedule in pending_schedules:
        try:
            schedule.status = 'in_progress'
            schedule.save()
            
            sent_count = 0
            failed_count = 0
            
            for email in schedule.recipient_emails:
                try:
                    validate_email(email)
                    send_mail(
                        schedule.subject,
                        schedule.body,
                        settings.EMAIL_HOST_USER,
                        [email],
                        fail_silently=False,
                    )
                    
                    # Log successful email
                    EmailLog.objects.create(
                        email_schedule=schedule,
                        recipient_email=email,
                        success=True
                    )
                    sent_count += 1
                    
                except Exception as e:
                    # Log failed email
                    EmailLog.objects.create(
                        email_schedule=schedule,
                        recipient_email=email,
                        success=False,
                        error_message=str(e)
                    )
                    failed_count += 1
            
            # Update schedule status
            if failed_count == 0:
                schedule.status = 'completed'
            else:
                schedule.status = 'failed' if sent_count == 0 else 'completed'
                schedule.error_message = f"Failed to send {failed_count} out of {len(schedule.recipient_emails)} emails"
            
            schedule.sent_at = timezone.now()
            schedule.save()
            
            sent_summary[schedule.department] = {
                'sent_count': sent_count,
                'failed_count': failed_count,
                'status': schedule.status
            }
            
        except Exception as e:
            schedule.status = 'failed'
            schedule.error_message = str(e)
            schedule.save()
            
            sent_summary[schedule.department] = {
                'sent_count': 0,
                'failed_count': len(schedule.recipient_emails),
                'status': 'failed',
                'error': str(e)
            }
    
    return sent_summary


def get_email_schedule_status():
    """
    Get the status of all email schedules.
    
    Returns:
        dict: Status summary of all email schedules
    """
    schedules = EmailSchedule.objects.all().order_by('-created_at')
    
    status_summary = {
        'total_schedules': schedules.count(),
        'pending': schedules.filter(status='pending').count(),
        'in_progress': schedules.filter(status='in_progress').count(),
        'completed': schedules.filter(status='completed').count(),
        'failed': schedules.filter(status='failed').count(),
        'schedules': []
    }
    
    for schedule in schedules[:20]:  # Return last 20 schedules
        status_summary['schedules'].append({
            'id': schedule.id,
            'department': schedule.department,
            'schedule_type': schedule.schedule_type,
            'scheduled_date': schedule.scheduled_date.strftime('%Y-%m-%d'),
            'status': schedule.status,
            'email_count': len(schedule.recipient_emails),
            'created_at': schedule.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'sent_at': schedule.sent_at.strftime('%Y-%m-%d %H:%M:%S') if schedule.sent_at else None
        })
    
    return status_summary