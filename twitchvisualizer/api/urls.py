from . import views
from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework import routers
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
# router.register(r'api', views.FilterView, basename='api')


urlpatterns = [
    path('api/', views.FilterView.as_view(), name="api"),
    path("^", include(router.urls))
]