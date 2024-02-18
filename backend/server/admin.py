from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(Candidate)
admin.site.register(Mentee)
admin.site.register(Admin)
admin.site.register(Meetings)
admin.site.register(Attendance)
admin.site.register(FormResponses)
admin.site.register(FormStatus)