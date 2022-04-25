from . import views
from django.contrib import admin
from django.urls import path, re_path
from rest_framework import routers
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'api', views.StreamViewset, basename='api')


urlpatterns = router.urls