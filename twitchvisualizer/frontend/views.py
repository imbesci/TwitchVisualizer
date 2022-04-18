from django.shortcuts import render
from api.tasks import celerytestfunction

# Create your views here.

def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')