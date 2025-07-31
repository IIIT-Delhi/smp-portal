from django.core.management.base import BaseCommand, CommandError
from server.view.helper_functions import send_scheduled_emails
from datetime import date


class Command(BaseCommand):
    help = 'Send scheduled emails for today'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be sent without actually sending emails',
        )

    def handle(self, *args, **options):
        """
        Handle the command execution
        """
        try:
            if options['dry_run']:
                self.stdout.write("DRY RUN MODE - No emails will be sent")
                # Show what would be sent
                from server.models import EmailSchedule
                today = date.today()
                pending_schedules = EmailSchedule.objects.filter(
                    scheduled_date=today,
                    status='pending'
                )
                
                if not pending_schedules.exists():
                    self.stdout.write(
                        self.style.WARNING('No emails scheduled for today')
                    )
                    return
                
                self.stdout.write(f"Found {pending_schedules.count()} email schedules for today:")
                for schedule in pending_schedules:
                    self.stdout.write(
                        f"  - {schedule.department}: {len(schedule.recipient_emails)} emails ({schedule.schedule_type})"
                    )
            else:
                self.stdout.write("Sending scheduled emails for today...")
                sent_summary = send_scheduled_emails()
                
                if not sent_summary:
                    self.stdout.write(
                        self.style.WARNING('No emails were scheduled for today')
                    )
                    return
                
                total_sent = 0
                total_failed = 0
                
                for department, summary in sent_summary.items():
                    sent_count = summary.get('sent_count', 0)
                    failed_count = summary.get('failed_count', 0)
                    status = summary.get('status', 'unknown')
                    
                    total_sent += sent_count
                    total_failed += failed_count
                    
                    if status == 'completed':
                        self.stdout.write(
                            self.style.SUCCESS(
                                f"{department}: Successfully sent {sent_count} emails"
                            )
                        )
                    elif status == 'failed':
                        self.stdout.write(
                            self.style.ERROR(
                                f"{department}: Failed to send emails - {summary.get('error', 'Unknown error')}"
                            )
                        )
                    else:
                        self.stdout.write(
                            f"{department}: Sent {sent_count} emails, {failed_count} failed"
                        )
                
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Email sending completed. Total sent: {total_sent}, Total failed: {total_failed}"
                    )
                )
                
        except Exception as e:
            raise CommandError(f'Error sending scheduled emails: {e}')
