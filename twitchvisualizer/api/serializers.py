from rest_framework import serializers


class ViewerDataSer(serializers.Serializer):
    id = serializers.IntegerField()
    channel_name = serializers.CharField(max_length=250)
    viewers = serializers.IntegerField()
    viewers_date = serializers.DateTimeField()
    channel_id = serializers.IntegerField()

