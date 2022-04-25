from django.db import models
from django.utils import timezone
import datetime
from django_celery_results.models import TaskResult
from django.db.models.functions import TruncSecond, TruncMinute, TruncHour, TruncDay

#Base class for entire api pull session
class FetchDateTimes(models.Model):
    class Meta:
        verbose_name_plural = "FetchDateTimes"

    fetch_date = models.DateTimeField('Created', default=timezone.now)
    
    def __str__(self):
        return f'{self.fetch_date}'

#Handle storage of access token fetching
class Security(models.Model):
    class Meta:
        verbose_name_plural = "Security" 

    access_token = models.CharField(max_length=250)
    expires_in = models.IntegerField()
    token_type = models.CharField(max_length=250)
    response_code = models.IntegerField(null=True)
    fetch_set = models.ForeignKey(FetchDateTimes, on_delete=models.CASCADE)
    creation_date = models.DateTimeField('Created', default=timezone.now)

    def __str__(self):
        return f'{self.creation_date}'

#Each celery fetch will be linked to models.FetchDateTimes
class CeleryFetchQuery(models.Model):
    class Meta:
        verbose_name_plural = "CeleryFetchQueries"
    
    fetch_set = models.ForeignKey(FetchDateTimes, on_delete=models.CASCADE)
    celery_task_id = models.ForeignKey(TaskResult, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.celery_task_id}'

#Handle storage of game ids
class GameData(models.Model):
    class Meta:
        verbose_name_plural = "GameData"

    game_name = models.CharField(max_length=250)
    game_id = models.IntegerField()
    fetch_set = models.ForeignKey(FetchDateTimes, on_delete=models.CASCADE)
    creation_date = models.DateTimeField('Created', default=timezone.now)

    def __str__(self):
        return f'{self.game_name}'
    
#Handle storage of channel id's
class ChannelData(models.Model):
    class Meta:
        verbose_name_plural = 'ChannelData'

    channel_name = models.CharField(max_length=250)
    channel_id = models.IntegerField()
    channel_login = models.CharField(max_length=250)
    fetch_set = models.ForeignKey(FetchDateTimes, on_delete=models.CASCADE)
    creation_date = models.DateTimeField('Created', default=timezone.now)

    def __str__(self) -> str:
        return f'{self.channel_name}'

#Stream viewer info
class Stream(models.Model):
    class Meta:
        verbose_name_plural = 'Streams'
    
    channel = models.ForeignKey(ChannelData, on_delete=models.CASCADE)
    viewer_count = models.IntegerField()
    game_played = models.ForeignKey(GameData, on_delete=models.CASCADE)
    stream_date = models.DateTimeField(null=True)
    fetch_set = models.ForeignKey(FetchDateTimes, on_delete=models.CASCADE)
    creation_date = models.DateTimeField('Created', default=timezone.now)


    def __str__(self) -> str:
        return f'{self.channel.channel_name}:{self.viewer_count}'
    

#Storage of different timeframe data for future serialization
class ThreeMinuteData(models.Model):
    class Meta:
        verbose_name_plural = 'One Minute Data'
    
    channel_name = models.CharField(max_length=250)
    viewers = models.IntegerField()
    viewers_date = models.DateTimeField()
    channel_id = models.IntegerField()

    def __str__(self) -> str:
        return f'{self.channel_name} || {self.viewers} || {self.viewers_date}'

class FifteenMinuteData(models.Model):
    class Meta:
        verbose_name_plural = 'Fifteen Minute Data'
    
    channel_name = models.CharField(max_length=250)
    viewers = models.IntegerField()
    viewers_date = models.DateTimeField()
    channel_id = models.IntegerField()

    def __str__(self) -> str:
        return f'{self.channel_name} || {self.viewers} || {self.viewers_date}'

class OneHourData(models.Model):
    class Meta:
        verbose_name_plural = 'Hourly Data'
    
    channel_name = models.CharField(max_length=250)
    viewers = models.IntegerField()
    viewers_date = models.DateTimeField()
    channel_id = models.IntegerField()

    def __str__(self) -> str:
        return f'{self.channel_name} || {self.viewers} || {self.viewers_date}'
    
class FourHourData(models.Model):
    class Meta:
        verbose_name_plural = '4 Hour Data'
    
    channel_name = models.CharField(max_length=250)
    viewers = models.IntegerField()
    viewers_date = models.DateTimeField()
    channel_id = models.IntegerField()

    def __str__(self) -> str:
        return f'{self.channel_name} || {self.viewers} || {self.viewers_date}'

class DailyData(models.Model):
    class Meta:
        verbose_name_plural = 'Daily Data'
    
    channel_name = models.CharField(max_length=250)
    viewers = models.IntegerField()
    viewers_date = models.DateTimeField()
    channel_id = models.IntegerField()

    def __str__(self) -> str:
        return f'{self.channel_name} || {self.viewers} || {self.viewers_date}'

####                                     ####