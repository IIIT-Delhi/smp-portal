# Email Scheduling System Documentation

## Overview
The SMP Portal now includes a department-wise email scheduling system that respects SMTP daily limits (150 emails per day) and ensures proper delivery of mentor-mentee mapping emails.

## Key Features

### 1. Department-wise Email Batching
- Emails are automatically grouped by department (B-CSE, B-CSB, M-CSE, etc.)
- Each department's emails are scheduled for different days
- Maximum 150 emails per day limit is respected
- Automatic scheduling spreads load across multiple days

### 2. Email Schedule Management
- Track all email schedules and their status
- View detailed logs of email delivery
- Reschedule failed email batches
- Manual trigger for sending today's emails

### 3. Attendance Cross-check Improvements
- Fixed issue where admin meetings weren't showing in attendance reports
- Now includes all meetings (mentor-scheduled and admin-scheduled)
- Better coverage of mentee attendance tracking

## Database Models

### EmailSchedule
- Tracks email batches scheduled for different departments
- Fields: department, schedule_type, subject, body, recipient_emails, scheduled_date, status
- Status: pending, in_progress, completed, failed

### EmailLog
- Individual email delivery logs
- Links to EmailSchedule for batch tracking
- Records success/failure and error messages

## API Endpoints

### Email Schedule Management
- `GET /api/getEmailSchedules/` - Get all email schedules with status
- `POST /api/sendTodaysEmails/` - Manually send today's scheduled emails
- `POST /api/rescheduleFailedEmails/` - Reschedule failed email batches
- `GET /api/getEmailLogs/?schedule_id=X` - Get logs for specific schedule

## Usage

### Automated Daily Sending
A cron job runs daily at 9 AM to send scheduled emails:
```bash
# View what would be sent (dry run)
python manage.py send_scheduled_emails --dry-run

# Actually send emails
python manage.py send_scheduled_emails
```

### Manual Management
Access the Email Schedule Manager component at `/users/admin/email-schedules` to:
- View all email schedules
- Monitor delivery status
- Reschedule failed emails
- Send today's emails manually

### Department-wise Scheduling Example
When creating mentor-mentee pairs:
- Day 1: B-CSE department emails (50 emails)
- Day 2: B-CSB department emails (40 emails)  
- Day 3: M-CSE department emails (30 emails)
- Day 4: B-ECE department emails (45 emails)
- etc.

## Benefits

### Reliability
- No more failed bulk email sends due to SMTP limits
- Automatic retry mechanism for failed emails
- Detailed logging for troubleshooting

### Compliance
- Respects SMTP provider daily limits
- Prevents account suspension due to bulk sending
- Better email deliverability

### Monitoring
- Real-time status of email delivery
- Failed email identification and rescheduling
- Historical logs for audit purposes

## Setup Instructions

1. Run database migrations:
```bash
python manage.py makemigrations server
python manage.py migrate
```

2. Set up the cron job:
```bash
# Add to crontab (runs daily at 9 AM)
0 9 * * * cd /path/to/project && python manage.py send_scheduled_emails
```

3. Add EmailScheduleManager component to admin routes:
```javascript
import EmailScheduleManager from '../components/users/admin/EmailScheduleManager';

// Add route
<Route path="/users/admin/email-schedules" element={<EmailScheduleManager />} />
```

4. Configure email settings in Django settings.py:
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
```

## Migration Guide

### From Old System
The old system sent all emails immediately in bulk. The new system:
1. Creates email schedules for each department
2. Spreads sending across multiple days
3. Provides better monitoring and retry capabilities

### Existing Code Changes
- `create_mentor_mentee_pairs()` now uses `schedule_department_wise_emails()`
- AttendanceCrossCheck component now fetches all meetings (including admin)
- New email management interface for admins

## Troubleshooting

### Common Issues
1. **Emails not sending**: Check cron job setup and email configuration
2. **Failed email batches**: Use reschedule functionality in admin interface
3. **Admin meetings not showing**: Ensure updated AttendanceCrossCheck component

### Logs
- Cron job logs: `/var/log/smp_email_cron.log`
- Django logs: Check your Django logging configuration
- Email logs: Available through admin interface

## Future Enhancements
- Email templates with better formatting
- Personalized email content
- SMS notifications as backup
- Integration with external email services (SendGrid, Mailgun)
- Advanced scheduling options (specific times, custom delays)
