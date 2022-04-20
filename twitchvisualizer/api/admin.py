from django.contrib import admin
import api.models as apimodels

# Register your models here.




class SecurityAdmin(admin.ModelAdmin):
    readonly_fields = ('access_token', 'expires_in', 'token_type', 'response_code', 'fetch_set', 'object_creation_date')
    list_display = readonly_fields

class FetchDateTimesAdmin(admin.ModelAdmin):
    readonly_fields = ('fetch_date',)
    list_display = ('fetch_date',)

class GameDataAdmin(admin.ModelAdmin):
    readonly_fields = ('game_name', 'game_id', 'fetch_set', 'object_creation_date')
    list_display = readonly_fields

class CeleryFetchQueryAdmin(admin.ModelAdmin):
    readonly_fields = ('fetch_set', 'celery_task_id')
    list_display = readonly_fields

class ChannelDataAdmin(admin.ModelAdmin):
    readonly_fields = ('channel_name', 'channel_id', 'channel_login', 'fetch_set', 'object_creation_date')
    list_display = readonly_fields

class StreamAdmin(admin.ModelAdmin):
    readonly_fields = ('channel', 'viewer_count', 'stream_started_at', 'fetch_set', 'object_creation_date')
    list_display = ('channel', 'viewer_count', 'stream_started_at', 'fetch_set', 'object_creation_date') 




admin.site.register(apimodels.Security, SecurityAdmin)
admin.site.register(apimodels.FetchDateTimes, FetchDateTimesAdmin)
admin.site.register(apimodels.GameData, GameDataAdmin)
admin.site.register(apimodels.CeleryFetchQuery, CeleryFetchQueryAdmin)
admin.site.register(apimodels.ChannelData, ChannelDataAdmin)
admin.site.register(apimodels.Stream, StreamAdmin)