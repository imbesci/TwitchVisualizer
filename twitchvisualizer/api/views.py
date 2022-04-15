from django.shortcuts import render
from .models import Leads
from .serializers import LeadSerializer
from rest_framework import generics

class LeadListCreate(generics.ListCreateAPIView):
    queryset = Leads.objects.all()
    serializer_class = LeadSerializer