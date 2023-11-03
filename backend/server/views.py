from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Data
# Create your views here.
@csrf_exempt
def trying(request):
    print("got the data from react")
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        desc = data.get('desc')
        if(desc):
    #         data_obj = Data(desc=desc)
    #         data_obj.save()
    #         print("Saved successfully")
    #         return JsonResponse({"message": "Data saved successfully"})
    #     else:
    #         return JsonResponse({"message": "Invalid data"})
    # else:
    #     return JsonResponse({"message": "Invalid request method"})
            data_objects = Data.objects.filter(desc=desc)
            if data_objects.exists():
                data_objects.delete()
                return JsonResponse({"message": f"Data with desc '{desc}' deleted successfully"})
            else:
                return JsonResponse({"message": f"No data with desc '{desc}' found"})
        else:
            return JsonResponse({"message": "Invalid data"})
    else:
        return JsonResponse({"message": "Invalid request method"})

def index(request):
    print("react app got into index")
    return HttpResponse("home")