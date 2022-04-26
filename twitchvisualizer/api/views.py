from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from api.models import FifteenMinuteData
from .serializers import ViewerDataSer
from rest_framework import permissions
from .models import Stream, ThreeMinuteData, OneHourData, FourHourData, DailyData, ChannelData
# Create your views here.

class FilterView(APIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    const_timeseries = ['3T','15T', '1H', '4H', 'D']
    timeseries_to_model = {
        '3T': ThreeMinuteData,
        '15T': FifteenMinuteData,
        '1H': OneHourData,
        '4H': FourHourData,
        'D': DailyData,
        }
    
    def get(self, request, *args, **kwargs):
        organized_data = {
            '3T':{},
            '15T':{},
            '1H':{},
            '4H':{},
            'D':{}
        }

        unique_streamers = Stream.objects.values('channel').distinct()
        for ind, streamer in enumerate(unique_streamers):
            name = ChannelData.objects.get(pk = streamer['channel']).channel_name
            for time in self.const_timeseries:
                data = self.timeseries_to_model[time].objects.filter(channel_name = name).order_by('viewers_date').values()
                organized_data[time][name] = ViewerDataSer(data, many=True).data
        
        return Response(organized_data)