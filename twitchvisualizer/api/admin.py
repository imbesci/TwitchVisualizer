from django.contrib import admin
import api.models as apimodels

# Register your models here.

admin.site.register(apimodels.FetchDateTimes)
admin.site.register(apimodels.Security)
admin.site.register(apimodels.GameData)
admin.site.register(apimodels.CeleryFetchQuery)
