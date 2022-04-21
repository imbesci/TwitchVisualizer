from . import views
from django.contrib import admin
from django.urls import path, re_path


urlpatterns = [
    path('streamdata/', views.stream_data, name='streamapi')
]