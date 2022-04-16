from django.db import models


# Create your models here.

class Security(models.Model):
    class Meta:
        verbose_name_plural = "Security"
    
    client_id = models.CharField(max_length=150)
    client_secret = models.CharField(max_length=150)
    access_token  = models.CharField(max_length=150)
    expires_in = models.IntegerField()
    token_type = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.created_at}'


class GameData(models.Model):
    class Meta:
        verbose_name_plural = "Game Data"

    game_id = models.IntegerField()
    game_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)


class StreamerData(models.Model):
    class Meta:
        verbose_name_plural = "Streamer Data"

    streamer_id = models.IntegerField()
    streamer_login = models.CharField(max_length=100)
    streamer_name = models.CharField(max_length=100)

