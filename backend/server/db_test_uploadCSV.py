import io
import csv
from django.test import Client, TestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.http import JsonResponse
from .models import Mentee

class UploadCSVTestCase(TestCase):
    client = Client()
    def test_upload_csv_success(self):
        # Test the successful upload and processing of a CSV file
        csv_data = 'id,email,name,department\n1,mentee1@example.com,Mentee 1,CS\n2,mentee2@example.com,Mentee 2,EE'
        csv_file = SimpleUploadedFile("mentees.csv", csv_data.encode())

        response = self.client.post(reverse('uploadCSV'), {'csvFile': csv_file}, content_type='multipart/form-data')

        if response.status_code != 200:
            print(f"Response content: {response.content.decode('utf-8')}")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'message': 'File uploaded and processed successfully'})

        # Check if mentees are actually added to the database
        mentees = Mentee.objects.all()
        self.assertEqual(len(mentees), 2)
        self.assertEqual(mentees[0].id, '1')
        self.assertEqual(mentees[0].email, 'mentee1@example.com')
        self.assertEqual(mentees[0].name, 'Mentee 1')
        self.assertEqual(mentees[0].department, 'CS')

    def test_upload_csv_no_file(self):
        # Test when no file is uploaded
        response = self.client.post(reverse('uploadCSV'))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'message': 'No file was uploaded'})

    def test_upload_csv_invalid_method(self):
        # Test sending a GET request, which should result in an error
        response = self.client.get(reverse('uploadCSV'))

        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json(), {'message': 'Unsupported HTTP method'})