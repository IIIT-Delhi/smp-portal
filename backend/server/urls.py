from django.contrib import admin
from django.urls import path, include
from server import views

urlpatterns = [
    path('', views.index, name="home"),
     path('', include('server.view.urls')),   
]

