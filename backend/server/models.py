from django.db import models

# Create your models here.

class Candidate(models.Model):
    id = models.CharField(primary_key=True)
    email = models.CharField()
    name = models.CharField()
    department = models.CharField()
    year = models.CharField()
    status = models.IntegerField()
    """
    1 - Form filled 
    2 - mentor selected and consent form mail send 
    3 - mentees assigned 
    4 - rejected
    -1 - anyother 
    """
    size = models.CharField()
    score = models.CharField()
    imgSrc = models.TextField()

    def __str__(self):
        return self.id

class Mentee(models.Model):
    id = models.CharField(primary_key=True)
    email = models.CharField()
    name = models.CharField()
    department = models.CharField()
    imgSrc = models.TextField()
    mentorId = models.CharField() # id of the mentor

    def __str__(self):
        return self.id
    
class Mentor(models.Model):
    id = models.CharField(primary_key=True)
    goodiesStatus = models.IntegerField()
    """
    0 - not collected 
    1 - collected 
    """
    reimbursement = models.IntegerField()

    def __str__(self):
        return self.id

class Admin(models.Model):
    id = models.CharField(primary_key=True)
    email = models.CharField()
    name = models.CharField()
    department = models.CharField()
    phone = models.CharField()
    address = models.CharField()
    imgSrc = models.TextField()

    def __str__(self):
        return self.id

class Meetings(models.Model):
    meetingId = models.AutoField(primary_key=True)  
    schedulerId = models.CharField(max_length=255)
    date = models.CharField(max_length=255)
    time = models.CharField(max_length=255)
    attendee = models.IntegerField()
    """
    1: mentor 
    2: mentee
    3: both 
    """
    description = models.TextField()

    def __str__(self):
        return str(self.meeting_id)

class Attendance(models.Model):
    attendeeId = models.CharField(primary_key=True)
    meeting = models.JSONField(null=True)

    def __str__(self):
        return self.attendee_id

class FormResponses(models.Model):
    formId = models.CharField(primary_key=True)
    submitterId = models.CharField()
    responses = models.JSONField(null=True)

    def __str__(self):
        return self.form_id

   