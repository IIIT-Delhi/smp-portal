from django.db import models

# Create your models here.

class Candidate(models.Model):
    roll_no = models.CharField(primary_key=True)
    email = models.CharField()
    name = models.CharField()
    department = models.CharField()
    year = models.CharField()
    status = models.CharField
    size = models.CharField()
    score = models.CharField()

    def __str__(self):
        return self.roll_no

class Mentee(models.Model):
    roll_no = models.CharField(primary_key=True)
    email = models.CharField()
    name = models.CharField()
    department = models.CharField()
    mentor = models.CharField() # roll_no of the mentor

    def __str__(self):
        return self.roll_no
    
class Mentor(models.Model):
    roll_no = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    goods_status = models.CharField()
    reimbursement = models.CharField()

    def __str__(self):
        return self.roll_no

class Admin(models.Model):
    id = models.CharField(primary_key=True)
    email = models.CharField()
    name = models.CharField()
    department = models.CharField()

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
    meeting = models.JSONField()

    def __str__(self):
        return self.attendee_id

class FormResponses(models.Model):
    form_id = models.CharField(primary_key=True)
    submitter_id = models.CharField()
    responses = models.JSONField()

    def __str__(self):
        return self.form_id

   