from django.db import models

class Candidate(models.Model):
    id = models.CharField(primary_key=True)
    email = models.CharField(null=False)  # Ensure email is not null
    name = models.CharField(null=False)  # Ensure name is not null
    department = models.CharField(null=False)  # Ensure department is not null
    year = models.CharField(null=False)  # Ensure year is not null
    status = models.IntegerField(null=False)  # Ensure status is not null
    contact = models.CharField(null=False)  # Ensure contact is not null
    size = models.CharField() 
    score = models.CharField(null=False)  # Ensure score is not null
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
    id = models.CharField(primary_key=True)
    email = models.CharField(null=False)  # Ensure email is not null
    name = models.CharField(null=False)  # Ensure name is not null
    department = models.CharField(null=False)  # Ensure department is not null
    contact = models.CharField(null=False)  # Ensure contact is not null
    imgSrc = models.TextField()  # Ensure imgSrc is not null
    mentorId = models.CharField()  # Ensure mentorId is not null

    def __str__(self):
        return self.id
    
    class Meta:
        app_label = 'server'


class Admin(models.Model):
    id = models.CharField(primary_key=True)
    email = models.CharField(null=False)  # Ensure email is not null
    name = models.CharField(null=False)  # Ensure name is not null
    department = models.CharField(null=False)  # Ensure department is not null
    phone = models.CharField(null=False)  # Ensure phone is not null
    address = models.CharField(null=False)  # Ensure address is not null
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
    attendeeId = models.CharField(null=False)  # Ensure attendeeId is not null
    meetingId = models.JSONField(null=True)  # meetingId can be null

    def __str__(self):
        return self.id
    
    class Meta:
        app_label = 'server'


class FormResponses(models.Model):
    SubmissionId = models.AutoField(primary_key=True)
    submitterId = models.CharField(null=False)  # Ensure submitterId is not null
    FormType =  models.CharField(null=False)  # Ensure FormType is not null
    responses = models.JSONField(null=True)

    def __str__(self):
        return self.SubmissionId
    
    class Meta:
        app_label = 'server'


class FormStatus(models.Model):
    formId = models.CharField(primary_key=True)
    formStatus = models.CharField(null=False)  # Ensure formStatus is not null

    def __str__(self):
        return self.formId
    
    class Meta:
        app_label = 'server'


class ExcellenceAward(models.Model):
    id = models.AutoField(primary_key=True)
    candidateId = models.CharField(null=False)  # Ensure candidateId is not null

    def __str__(self):
        return str(self.id)
    
    class Meta:
        app_label = 'server'