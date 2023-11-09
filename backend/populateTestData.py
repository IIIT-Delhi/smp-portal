import os
import django
import sys
os.environ['DJANGO_SETTINGS_MODULE'] = 'backend/core/settings.py'

from django.conf import settings

# Check if the settings are configured
if not settings.configured:
    settings.configure()

django.setup()

from server.models import Candidate, Mentor, Mentee, Admin, Meetings


def populateCandidate():
    Candidate.objects.all().delete()
    data = [
        ["1", "vishesh20550@iiitd.ac.in", "Vishesh Jain", "B-CSB", "2020", 3, "M", 100, ""],
        ["2", "john12345@iiitd.ac.in", "John", "B-CSAI", "2020", 1, "L", 90, ""],
        ["3", "joe12345@iiitd.ac.in", "Joe", "B-CSE", "2021", 2, "L", 90, ""],
        ["4", "max12345@iiitd.ac.in", "Max", "B-CSAM", "2020", 4, "M", 70, ""],
        ["5", "lisa12345@iiitd.ac.in", "Lisa", "B-CSE", "2020", 3, "L", 100, ""],
    ]

    for row in data:
        new_candidate = Candidate(id=row[0], email=row[1], name=row[2], department=row[3], year=row[4],
                                    status=row[5], size=row[6], score=row[7], imgSrc=row[8])
        new_candidate.save()
    return

def populateMentor():
    Mentor.objects.all().delete()
    data = [
        ["1", 0, 0],
        ["5", 0, 0],
    ]

    for row in data:
        new_mentor = Mentor(id=row[0], goodiesStatus=row[1], reimbursement=row[2])
        new_mentor.save()
    return

def populateMentee():
    Mentee.objects.all().delete()
    data = [
        ["1", "mohit20086@iiitd.ac.in", "Mohit Sharma", "B-CSB", "", "1"],
        ["2", "devraj20054@iiitd.ac.in", "Devraj Sharma", "B-CSE", "", "5"],
        ["3", "riya12345@iiitd.ac.in", "Riya", "B-CSB", "", "1"],
        ["4", "sam12345@iiitd.ac.in", "Sam", "B-CSE", "", "5"],
    ]

    for row in data:
        new_mentee = Mentee(id=row[0], email=row[1], name=row[2], department=row[3], imgSrc=row[4], mentorId=row[5])
        new_mentee.save()
    return

def populateAdmin():
    Admin.objects.all().delete()
    data = [
        ["1", "aishwary20490@iiitd.ac.in", "Aishwary Sharma", "Counselling", "123456", "Old Acad", ""]
    ]

    for row in data:
        new_admin = Admin(id=row[0], email=row[1], name=row[2], department=row[3], phone=row[4], address=row[5], imgSrc=row[6])
        new_admin.save()
    return

def populateMeetings():
    Meetings.objects.all().delete()
    data = [
        ["1", "1", "09/11/2023", "12:30", 2, "Test Meeting from mentorId=1"],
        ["2", "5", "10/11/2023", "01:30", 2, "Test Meeting from mentorId=5"],
        ["3", "1", "10/11/2023", "02:30", 1, "Test Meeting from AdminId=1"],
        ["4", "1", "11/11/2023", "03:30", 2, "Test Meeting from AdminId=1"],
        ["5", "1", "12/11/2023", "04:30", 3, "Test Meeting from AdminId=1"],
    ]

    for row in data:
        new_meeting = Meetings(meetingId=row[0], schedulerId=row[1], date=row[2], time=row[3], attendee=row[4], description=row[5])
        new_meeting.save()
    return


populateCandidate()
populateMentor()
populateMentee()
populateAdmin()
populateMeetings()
# if __name__=='__main__':
    # sys.path.append("/path/to/your/django/project")
    # os.environ.setdefault("DJANGO_SETTINGS_MODULE", "your_project_name.settings")
    # django.setup()

    # populateCandidate()
    # populateMentor()
    # populateMentee()
    # populateAdmin()
    # populateMeetings()