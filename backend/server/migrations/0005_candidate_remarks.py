# Generated by Django 5.0.6 on 2024-07-18 06:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0004_excellenceaward'),
    ]

    operations = [
        migrations.AddField(
            model_name='candidate',
            name='remarks',
            field=models.TextField(blank=True, null=True),
        ),
    ]
