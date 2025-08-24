from http.client import HTTPResponse
from django.shortcuts import render

def index(request):
    return HTTPResponse("home")
