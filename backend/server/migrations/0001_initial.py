# Generated by Django 5.0.6 on 2025-07-18 16:25

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('email', models.CharField(max_length=100)),
                ('name', models.CharField(max_length=100)),
                ('department', models.CharField(max_length=50)),
                ('phone', models.CharField(max_length=20)),
                ('address', models.CharField(max_length=200)),
                ('imgSrc', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Attendance',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('attendeeId', models.CharField(max_length=50)),
                ('meetingId', models.JSONField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Candidate',
            fields=[
                ('id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('email', models.CharField(max_length=100)),
                ('name', models.CharField(max_length=100)),
                ('department', models.CharField(max_length=50)),
                ('year', models.CharField(max_length=20)),
                ('status', models.IntegerField()),
                ('contact', models.CharField(max_length=20)),
                ('size', models.CharField(max_length=10)),
                ('score', models.CharField(max_length=20)),
                ('remarks', models.TextField(blank=True, null=True)),
                ('imgSrc', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='ExcellenceAward',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('candidateId', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='FormQuestions',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('formType', models.CharField(max_length=50)),
                ('question', models.TextField()),
                ('type', models.CharField(default='text', max_length=50)),
                ('options', models.TextField(blank=True, null=True)),
                ('required', models.BooleanField(default=True)),
                ('order', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'ordering': ['order', 'id'],
            },
        ),
        migrations.CreateModel(
            name='FormResponses',
            fields=[
                ('SubmissionId', models.AutoField(primary_key=True, serialize=False)),
                ('submitterId', models.CharField(max_length=50)),
                ('FormType', models.CharField(max_length=50)),
                ('responses', models.JSONField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='FormStatus',
            fields=[
                ('formId', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('formStatus', models.CharField(max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='Meetings',
            fields=[
                ('meetingId', models.AutoField(primary_key=True, serialize=False)),
                ('schedulerId', models.CharField(max_length=255)),
                ('title', models.CharField(max_length=255)),
                ('date', models.CharField(max_length=255)),
                ('time', models.CharField(max_length=255)),
                ('attendee', models.IntegerField()),
                ('mentorBranches', models.JSONField(default=list)),
                ('menteeBranches', models.JSONField(default=list)),
                ('menteeList', models.JSONField(default=list)),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Mentee',
            fields=[
                ('id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('email', models.CharField(max_length=100)),
                ('name', models.CharField(max_length=100)),
                ('department', models.CharField(max_length=50)),
                ('contact', models.CharField(max_length=20)),
                ('imgSrc', models.TextField()),
                ('mentorId', models.CharField(max_length=50)),
            ],
        ),
    ]
