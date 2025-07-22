from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from server.models import EmailSchedule, EmailLog
from server.view.helper_functions import send_scheduled_emails, get_email_schedule_status
from datetime import date


@csrf_exempt
def get_email_schedules(request):
    """
    Get all email schedules with their status.
    """
    if request.method == "GET":
        try:
            status_summary = get_email_schedule_status()
            return JsonResponse(status_summary)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def send_todays_emails(request):
    """
    Manually trigger sending of today's scheduled emails.
    """
    if request.method == "POST":
        try:
            sent_summary = send_scheduled_emails()
            return JsonResponse({
                "message": "Emails sent successfully",
                "summary": sent_summary
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def reschedule_failed_emails(request):
    """
    Reschedule failed email batches to today.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            schedule_ids = data.get('schedule_ids', [])
            
            updated_count = 0
            for schedule_id in schedule_ids:
                try:
                    schedule = EmailSchedule.objects.get(id=schedule_id, status='failed')
                    schedule.scheduled_date = date.today()
                    schedule.status = 'pending'
                    schedule.error_message = None
                    schedule.save()
                    updated_count += 1
                except EmailSchedule.DoesNotExist:
                    continue
            
            return JsonResponse({
                "message": f"Rescheduled {updated_count} failed email batches",
                "updated_count": updated_count
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def get_email_logs(request):
    """
    Get email logs for a specific schedule.
    """
    if request.method == "GET":
        try:
            schedule_id = request.GET.get('schedule_id')
            if not schedule_id:
                return JsonResponse({"error": "schedule_id is required"}, status=400)
            
            logs = EmailLog.objects.filter(email_schedule_id=schedule_id).order_by('-sent_at')
            
            log_data = []
            for log in logs:
                log_data.append({
                    'id': log.id,
                    'recipient_email': log.recipient_email,
                    'sent_at': log.sent_at.strftime('%Y-%m-%d %H:%M:%S'),
                    'success': log.success,
                    'error_message': log.error_message
                })
            
            return JsonResponse({
                "logs": log_data,
                "total_count": len(log_data)
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)
