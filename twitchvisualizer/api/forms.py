from django.forms import ModelForm
from .models import Security, GameData, StreamerData


class SecurityForm(ModelForm):
    class Meta:
        model = Security
        fields = ["client_id", "client_secret", "access_token", "expires_in", ]

class GameDataForm(ModelForm):
    class Meta:
        model = GameData
        fields = ["game_id", "game_name"]

class StreamerForm(ModelForm):
    class Meta:
        model = StreamerData
        fields = ["streamer_id", "streamer_login", "streamer_name"]