from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.response import Response
from api.models import FifteenMinuteData
from .serializers import ViewerDataSer
# Create your views here.

class StreamViewset(ModelViewSet):
    queryset = FifteenMinuteData.objects.all()
    serializer_class = ViewerDataSer
