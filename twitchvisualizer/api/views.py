from django.http import JsonResponse
from django.shortcuts import render
from .twitch import separate_data

# Create your views here.

def stream_data(request):
    data = separate_data(1)
    if request.method == 'GET':
        context = {
            'data': data
        }
        return JsonResponse(data)