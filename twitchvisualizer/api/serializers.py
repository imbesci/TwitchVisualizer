from rest_framework import routers, serializers, viewsets
from api.models import OneMinuteData, FifteenMinuteData, OneHourData, FourHourData, DailyData

# class OneMinuteSer(serializers.ModelSerializer):
#     class Meta:
#         model = OneMinuteData
#         fields = ['channel_name', 'viewers', 'viewers_date', 'channel_id']

# class FifteenMinuteSer(serializers.ModelSerializer):
#     class Meta:
#         model = FifteenMinuteData
#         fields = ['channel_name', 'viewers', 'viewers_date', 'channel_id']

# class OneHourSer(serializers.ModelSerializer):
#     class Meta:
#         model = OneHourData
#         fields = ['channel_name', 'viewers', 'viewers_date', 'channel_id']

# class FourHourSer(serializers.ModelSerializer):
#     class Meta:
#         model = FourHourData
#         fields = ['channel_name', 'viewers', 'viewers_date', 'channel_id']

# class DailySer(serializers.ModelSerializer):
#     class Meta:
#         model = DailyData
#         fields = ['channel_name', 'viewers', 'viewers_date', 'channel_id']

class ViewerDataSer(serializers.Serializer):
    channel_name = serializers.CharField(max_length=250)
    viewers = serializers.IntegerField()
    viewers_date = serializers.DateTimeField()
    channel_id = serializers.IntegerField()


