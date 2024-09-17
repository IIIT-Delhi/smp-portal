# from typing import Any, Dict
# from django.http import JsonResponse
# import json
# from django.views.decorators.csrf import csrf_exempt
# from server.models import *


# @csrf_exempt
# def add_admin(request):
#     """
#     Handles a POST request to add a new admin to the database.

#     Args:
#         request (HttpRequest): The HTTP request object containing the POST data.

#     Returns:
#         JsonResponse: JSON response with a success message if the data was added successfully.
#                       JSON response with an error message if the request method is not POST.
#     """
#     if request.method == "POST":
#         # Parse the JSON data from the request body
#         data = json.loads(request.body.decode('utf-8'))

#         # Create a new Admin object with the provided data
#         new_admin = Admin.objects.create(
#             id=data.get('id'),
#             name=data.get('name'),
#             email=data.get('email'),
#             department=data.get('department'),
#             phone=data.get('phone'),
#             address=data.get('address'),
#             imgSrc=data.get('imgSrc')
#         )

#         # Return a JSON response with a success message
#         return JsonResponse({"message": "Data added successfully"})
#     else:
#         # Return a JSON response with an error message
#         return JsonResponse({"message": "Invalid request method"})
    

# @csrf_exempt
# def edit_admin_by_id(request):
#     """
#     Handles a POST request to edit an admin's information.

#     Args:
#         request (HttpRequest): The HTTP request object containing the data to edit an admin's information.

#     Returns:
#         JsonResponse: {"message": "data added successfully"} if the operation is successful,
#                       or {"message": "Invalid request method"} if the request method is not POST.
#     """
#     if request.method == "POST":
#         data = json.loads(request.body.decode('utf-8'))
#         admin_id = data.get('id')
#         field_name = data.get('fieldName')
#         new_value = data.get('newValue')

#         try:
#             admin = Admin.objects.get(id=admin_id)
#             setattr(admin, field_name, new_value)
#             admin.save()
#             return JsonResponse({"message": "data added successfully"})
#         except Admin.DoesNotExist:
#             return JsonResponse({"message": "Admin not found"})
#     else:
#         return JsonResponse({"message": "Invalid request method"})


# def get_all_admins(request: Any) -> JsonResponse:
#     """
#     Returns a JSON response containing a list of all admin objects in the database.

#     Args:
#         request (object): The HTTP request object.

#     Returns:
#         JsonResponse: A JSON response containing a list of all admin objects in the database.
#     """
#     if request.method == "GET":
#         admins = list(Admin.objects.all().values())  # Fetch all Admin objects from the database.
#         return JsonResponse(admins, safe=False)
#     else:
#         return JsonResponse({"message": "Invalid request method"})

# def get_admin_by_id(request):
#     # returns list of json with one element; [{details}]
#     if request.method == "GET":
#         id_to_search = json.loads(request.body.decode('utf-8')).get('id')
#         admin = Admin.objects.filter(id=id_to_search).values()
#         return JsonResponse(list(admin), safe=False)
#     else:
#         return JsonResponse({"message": "Invalid request method"})

# def delete_all_admins(request):
#     # returns json ; {"message": "//message//"}
#     if request.method == "GET":
#         deleted = Admin.objects.all().delete()
#         return JsonResponse({"message": "deleted "+str(deleted[0])+" database entries"})
#     else:
#         return JsonResponse({"message": "Invalid request method"})

# def delete_admin_by_id(request):
#     # returns json ; {"message": "//message//"}
#     if request.method == "GET":
#         id_to_search = json.loads(request.body.decode('utf-8')).get('id')
#         deleted = Admin.objects.filter(id=id_to_search).delete()
#         return JsonResponse({"message": "deleted "+str(deleted[0])+" database entries"})
#     else:
#         return JsonResponse({"message": "Invalid request method"})
