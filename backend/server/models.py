from django.db import models

# Create your models here.

class Candidate(models.Model):
    id = models.CharField(primary_key=True)
    email = models.CharField()
    name = models.CharField()
    department = models.CharField()
    year = models.CharField()
    status = models.CharField
    size = models.CharField()
    score = models.CharField()
    imgSrc = models.TextField()

    def __str__(self):
        return self.roll_no

class Mentee(models.Model):
    id = models.CharField(primary_key=True)
    email = models.CharField()
    name = models.CharField()
    department = models.CharField()
    imgSrc = models.TextField()
    mentor_id = models.CharField() # id of the mentor

    def __str__(self):
        return self.roll_no
    
class Mentor(models.Model):
    id = models.CharField(primary_key=True)
    goodiesStatus = models.CharField()
    reimbursement = models.CharField()

    def __str__(self):
        return self.roll_no

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
    meeting_id = models.CharField(primary_key=True)
    scheduler_id = models.CharField()
    date = models.CharField()
    time = models.CharField()
    attendee = models.CharField()

    def __str__(self):
        return self.meeting_id

class Attendance(models.Model):
    attendee_id = models.CharField(primary_key=True)
    meeting = models.JSONField(null=True)

    def __str__(self):
        return self.attendee_id

class FormResponses(models.Model):
    form_id = models.CharField(primary_key=True)
    submitter_id = models.CharField()
    responses = models.JSONField(null=True)

    def __str__(self):
        return self.form_id

   