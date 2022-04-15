from django.db import models


# Create your models here.

class Leads(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
