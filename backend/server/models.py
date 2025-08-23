from django.db import models

class Candidate(models.Model):
    id = models.CharField(primary_key=True, max_length=50)
    email = models.CharField(null=False, max_length=100)  # Ensure email is not null
    name = models.CharField(null=False, max_length=100)  # Ensure name is not null
    department = models.CharField(null=False, max_length=50)  # Ensure department is not null
    year = models.CharField(null=False, max_length=20)  # Ensure year is not null
    status = models.IntegerField(null=False)  # Ensure status is not null
    contact = models.CharField(null=False, max_length=20)  # Ensure contact is not null
    size = models.CharField(max_length=10) 
    score = models.CharField(null=False, max_length=20)  # Ensure score is not null
    remarks = models.TextField(blank=True, null=True) 
    
    """
    1 - Form filled 
    2 - mentor selected and consent form mail send 
    3 - Consent form filled
    4 - rejected
    5 - mentee assigned 
    -1 - anyother
    """
    imgSrc = models.TextField()  # Ensure imgSrc is not null

    def __str__(self):
        return self.id

    class Meta:
        app_label = 'server'


class Mentee(models.Model):
    id = models.CharField(primary_key=True, max_length=50)
    email = models.CharField(null=False, max_length=100)  # Ensure email is not null
    name = models.CharField(null=False, max_length=100)  # Ensure name is not null
    department = models.CharField(null=False, max_length=50)  # Ensure department is not null
    contact = models.CharField(null=False, max_length=20)  # Ensure contact is not null
    imgSrc = models.TextField()  # Ensure imgSrc is not null
    mentorId = models.CharField(max_length=50)  # Ensure mentorId is not null
    first_login_completed = models.BooleanField(default=False)  # Track if initial setup is completed

    def __str__(self):
        return self.id
    
    class Meta:
        app_label = 'server'


class Admin(models.Model):
    id = models.CharField(primary_key=True, max_length=50)
    email = models.CharField(null=False, max_length=100)  # Ensure email is not null
    name = models.CharField(null=False, max_length=100)  # Ensure name is not null
    department = models.CharField(null=False, max_length=50)  # Ensure department is not null
    phone = models.CharField(null=False, max_length=20)  # Ensure phone is not null
    address = models.CharField(null=False, max_length=200)  # Ensure address is not null
    imgSrc = models.TextField()  # Ensure imgSrc is not null

    def __str__(self):
        return self.id
    
    class Meta:
        app_label = 'server'


class Meetings(models.Model):
    meetingId = models.AutoField(primary_key=True)  
    schedulerId = models.CharField(max_length=255, null=False)  # Ensure schedulerId is not null
    title = models.CharField(max_length=255, null=False)  # Ensure title is not null
    date = models.CharField(max_length=255, null=False)  # Ensure date is not null
    time = models.CharField(max_length=255, null=False)  # Ensure time is not null
    attendee = models.IntegerField(null=False)  # Ensure attendee is not null
    mentorBranches = models.JSONField(default=list, null=False)  # Ensure mentorBranches is not null
    menteeBranches = models.JSONField(default=list, null=False)  # Ensure menteeBranches is not null
    menteeList = models.JSONField(default=list, null=False)  # Ensure menteeList is not null
    """
    1: mentor 
    2: mentee
    3: both 
    """
    description = models.TextField(null=False)  # Ensure description is not null

    def __str__(self):
        return str(self.meetingId)
    
    class Meta:
        app_label = 'server'


class Attendance(models.Model):
    id = models.AutoField(primary_key=True)
    attendeeId = models.CharField(null=False, max_length=50)  # Ensure attendeeId is not null
    meetingId = models.JSONField(null=True)  # meetingId can be null

    def __str__(self):
        return str(self.id)
    
    class Meta:
        app_label = 'server'


class FormResponses(models.Model):
    SubmissionId = models.AutoField(primary_key=True)
    submitterId = models.CharField(null=False, max_length=50)  # Ensure submitterId is not null
    FormType = models.CharField(null=False, max_length=50)  # Ensure FormType is not null
    responses = models.JSONField(null=True)

    def __str__(self):
        return str(self.SubmissionId)
    
    class Meta:
        app_label = 'server'


class FormStatus(models.Model):
    formId = models.CharField(primary_key=True, max_length=50)
    formStatus = models.CharField(null=False, max_length=10)  # Ensure formStatus is not null

    def __str__(self):
        return self.formId
    
    class Meta:
        app_label = 'server'


class FormQuestions(models.Model):
    id = models.AutoField(primary_key=True)
    formType = models.CharField(null=False, max_length=50)  # Form type (registration, consent, feedback, etc.)
    question = models.TextField(null=False)  # The question text
    type = models.CharField(null=False, default='text', max_length=50)  # Question type (text, select, radio, etc.)
    options = models.TextField(null=True, blank=True)  # JSON string for options
    required = models.BooleanField(default=True)  # Whether the question is required
    order = models.IntegerField(null=True, blank=True)  # Order of question in form
    
    def __str__(self):
        return f"{self.formType} - {self.question[:50]}"
    
    class Meta:
        app_label = 'server'
        ordering = ['order', 'id']


class ExcellenceAward(models.Model):
    id = models.AutoField(primary_key=True)
    candidateId = models.CharField(null=False, max_length=50)  # Ensure candidateId is not null

    def __str__(self):
        return str(self.id)
    
    class Meta:
        app_label = 'server'


# New model for managing email scheduling
class EmailSchedule(models.Model):
    SCHEDULE_TYPES = (
        ('mentor_mapping', 'Mentor-Mentee Mapping'),
        ('consent', 'Consent Form'),
        ('general', 'General Email'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    
    id = models.AutoField(primary_key=True)
    schedule_type = models.CharField(max_length=50, choices=SCHEDULE_TYPES)
    subject = models.CharField(max_length=200)
    body = models.TextField()
    department = models.CharField(max_length=10)
    recipient_emails = models.JSONField()
    scheduled_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.department} - {self.schedule_type} - {self.scheduled_date}"
    
    class Meta:
        app_label = 'server'
        db_table = 'email_schedule'
        
        
class EmailLog(models.Model):
    id = models.AutoField(primary_key=True)
    email_schedule = models.ForeignKey(EmailSchedule, on_delete=models.CASCADE)
    recipient_email = models.EmailField()
    sent_at = models.DateTimeField(auto_now_add=True)
    success = models.BooleanField(default=True)
    error_message = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.recipient_email} - {self.sent_at}"
    
    class Meta:
        app_label = 'server'
        db_table = 'email_log'


class HistoricalData(models.Model):
    """
    Model to store historical mentor and mentee data from previous years.
    This table archives data when new batches are added.
    """
    id = models.AutoField(primary_key=True)
    academic_year = models.CharField(max_length=20)  # e.g., "2024-2025"
    semester = models.CharField(max_length=20, default="Even")  # "Odd" or "Even"
    user_type = models.CharField(max_length=10)  # "mentor" or "mentee" or "candidate"
    user_id = models.CharField(max_length=50)
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    department = models.CharField(max_length=50)
    contact = models.CharField(max_length=20, null=True, blank=True)
    imgSrc = models.TextField(null=True, blank=True)
    
    # Mentor specific fields
    year = models.CharField(max_length=20, null=True, blank=True)  # For mentors
    score = models.CharField(max_length=20, null=True, blank=True)  # For candidates/mentors
    status = models.IntegerField(null=True, blank=True)  # For candidates/mentors
    size = models.CharField(max_length=10, null=True, blank=True)  # For candidates
    remarks = models.TextField(null=True, blank=True)  # For candidates/mentors
    
    # Mentee specific fields  
    mentorId = models.CharField(max_length=50, null=True, blank=True)  # For mentees
    first_login_completed = models.BooleanField(default=False)  # For mentees
    
    # Archive metadata
    archived_at = models.DateTimeField(auto_now_add=True)
    archived_by = models.CharField(max_length=100, null=True, blank=True)  # Admin who archived
    
    def __str__(self):
        return f"{self.academic_year} - {self.user_type} - {self.name}"
    
    class Meta:
        app_label = 'server'
        db_table = 'historical_data'
        indexes = [
            models.Index(fields=['academic_year', 'user_type']),
            models.Index(fields=['user_type', 'department']),
        ]


class AcademicYear(models.Model):
    """
    Model to track academic years and manage current active year.
    """
    id = models.AutoField(primary_key=True)
    year = models.CharField(max_length=20, unique=True)  # e.g., "2024-2025"
    start_date = models.DateField()
    end_date = models.DateField()
    is_current = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.year} {'(Current)' if self.is_current else ''}"
    
    class Meta:
        app_label = 'server'
        db_table = 'academic_year'
        ordering = ['-year']