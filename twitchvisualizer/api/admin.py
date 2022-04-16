from django.contrib import admin
from .models import GameData, StreamerData, Security


admin.site.register(GameData)
admin.site.register(StreamerData)
admin.site.register(Security)