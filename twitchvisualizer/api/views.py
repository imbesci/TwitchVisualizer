from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics




def index(request):
    return HttpResponse(f'hopefully this runs.....')
