# Generated by Django 4.2.5 on 2023-11-07 17:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='candidate',
            name='status',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='meetings',
            name='description',
            field=models.TextField(default=0),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='meetings',
            name='attendee',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='meetings',
            name='date',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='meetings',
            name='meeting_id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='meetings',
            name='scheduler_id',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='meetings',
            name='time',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='mentor',
            name='goodiesStatus',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='mentor',
            name='reimbursement',
            field=models.IntegerField(),
        ),
    ]