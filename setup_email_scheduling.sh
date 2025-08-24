#!/bin/bash

# Email Schedule Setup Script for SMP Portal

echo "Setting up email scheduling system for SMP Portal..."

# Create database migrations for the new models
echo "Creating database migrations..."
cd /home/fakepickle/Programming/Git/smp-portal/backend
python manage.py makemigrations server
python manage.py migrate

# Create a cron job to send emails daily at 9 AM
echo "Setting up daily cron job for email sending..."

# Create the cron job script
cat > /tmp/smp_email_cron.sh << 'EOF'
#!/bin/bash
cd /home/fakepickle/Programming/Git/smp-portal/backend
source ../sdos/bin/activate
python manage.py send_scheduled_emails >> /var/log/smp_email_cron.log 2>&1
EOF

# Make the script executable
chmod +x /tmp/smp_email_cron.sh

# Add to cron (runs daily at 9 AM)
(crontab -l 2>/dev/null; echo "0 9 * * * /tmp/smp_email_cron.sh") | crontab -

echo "✅ Email scheduling system setup completed!"
echo ""
echo "Summary of changes:"
echo "1. Added EmailSchedule and EmailLog models to the database"
echo "2. Created API endpoints for managing email schedules"
echo "3. Updated mentor-mentee mapping to use department-wise scheduling"
echo "4. Fixed attendance cross-check to include admin meetings"
echo "5. Set up daily cron job to send scheduled emails at 9 AM"
echo ""
echo "Key features:"
echo "📧 Emails are now sent department-wise (150 emails per day limit respected)"
echo "📅 Each department gets emails on different days automatically"
echo "🔄 Failed emails can be rescheduled"
echo "📊 Detailed logging and monitoring of email delivery"
echo "👨‍💼 Admin meetings now show up in attendance cross-check"
echo ""
echo "Manual commands:"
echo "- Send today's emails: python manage.py send_scheduled_emails"
echo "- Dry run (preview): python manage.py send_scheduled_emails --dry-run"
echo "- View email schedules: Visit /users/admin/email-schedules (add to your routes)"
echo ""
echo "Note: Make sure to add the EmailScheduleManager component to your admin routes!"

# Create a sample .env reminder for email settings
cat > /tmp/email_settings_reminder.txt << 'EOF'
Make sure your Django settings.py has proper email configuration:

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'  # or your SMTP server
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@domain.com'
EMAIL_HOST_PASSWORD = 'your-password'  # Use app password for Gmail

Also consider setting up these environment variables:
- EMAIL_HOST_USER
- EMAIL_HOST_PASSWORD
EOF

echo "📋 Email configuration reminder saved to /tmp/email_settings_reminder.txt"
