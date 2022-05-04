from rest_framework import serializers


class ViewerDataSer(serializers.Serializer):
    viewers = serializers.IntegerField()
    viewers_date = serializers.DateTimeField()


