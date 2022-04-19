from django.db import models
from django.utils import timezone
from django_celery_results.models import TaskResult

#Base class for entire api pull session
class FetchDateTimes(models.Model):
    class Meta:
        verbose_name_plural = "FetchDateTimes"

    fetch_date = models.DateTimeField('Created', default=timezone.now)

#Handle storage of access token fetching
class Security(models.Model):
    class Meta:
        verbose_name_plural = "Security" 

    access_token = models.CharField(max_length=250)
    expires_in = models.IntegerField()
    token_type = models.CharField(max_length=250)
    response_code = models.IntegerField(null=True)
    fetch_set = models.ForeignKey(FetchDateTimes, on_delete=models.CASCADE)
    object_creation_date = models.DateTimeField('Created', default=timezone.now)

    def __str__(self):
        return f'{self.object_creation_date}'

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
    object_creation_date = models.DateTimeField('Created', default=timezone.now)

    def __str__(self):
        return f'Name: {self.game_name}, id: {self.game_id}'
    