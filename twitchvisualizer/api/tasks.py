import pandas as pd
import requests
from datetime import datetime, date, time, timedelta
from django.utils import timezone
from django.conf import settings
from .models import FetchDateTimes, Security, GameData, ChannelData, Stream,  OneMinuteData, FifteenMinuteData, OneHourData, FourHourData, DailyData
from django.db.models.functions import TruncDay
from celery import shared_task
from django_celery_beat.models import IntervalSchedule, PeriodicTask
import json

FETCH_COUNT = 0

def calculate_expiry(token_fetched_date, time_until_exp):
    """Determine how many seconds remain is remaining on current access token"""
    expiration_date = token_fetched_date + timedelta(seconds=time_until_exp)
    remaining_seconds =  timedelta.total_seconds(expiration_date - datetime.now(timezone.utc))
    return remaining_seconds
  

def check_token_valid():
    """Check to see if the most recent access token. Returns the most recent valid access token or False if unsuccessful"""

    valid_token, securities_set = None, Security.objects.order_by('creation_date').reverse()
    i = 0
    while i<len(securities_set):
        token_object = securities_set[i]
        fetch_date, time_until_exp = token_object.creation_date, token_object.expires_in
        if (token_object.token_type == "bearer") and (calculate_expiry(fetch_date, time_until_exp) > 600):
            valid_token = securities_set[i]
            break
    else:
        return False

    return valid_token.access_token
    

def fetch_access_token(id, secret, fetchdate_object):
    """Fetch new api token and log it to the database. Max retries: 3"""

    oauth_url = 'https://id.twitch.tv/oauth2/token'
    parameters = {
        'client_id':id, 
        'client_secret':secret,
        'grant_type':'client_credentials'
    }
    retry_count = 0
    while retry_count < 3:
        request_token = requests.post(oauth_url, params=parameters)
        status = request_token.status_code
        retry_count += 1
        if status == requests.codes.ok:
            response = request_token.json()
            token, expiry, token_type = response['access_token'], response['expires_in'], response['token_type']
            new_security_object = Security.objects.create(access_token=token, expires_in=expiry, token_type=token_type, response_code=status, fetch_set=fetchdate_object)
            return new_security_object
        else:    
            Security.objects.create(access_token=None, expires_in=None, token_type=None, response_code=status, fetch_set=fetchdate_object)
    else:
        raise "Unable to fetch new access token"


def fetch_get_games(id, token, new_date):
    get_games_url = 'https://api.twitch.tv/helix/games/top'
    auth_headers = {
        'Authorization': token,
        'Client-ID': id,
    }
    request_top_games = requests.get(get_games_url, headers=auth_headers)
    status = request_top_games.status_code
    if status ==  requests.codes.ok:
        response = request_top_games.json()
        for ind, item in enumerate(response['data']):
            GameData.objects.get_or_create(game_name=item['name'], game_id=item['id'], defaults = {'fetch_set': new_date,})
    else:
        GameData.objects.create(game_name='Failed', game_id=0, fetch_set=new_date)

def fetch_streams(id, token, new_date, game):
    get_streams_url = 'https://api.twitch.tv/helix/streams'
    auth_headers = {
        'Authorization': token,
        'Client-ID': id,
        }
    game_object = GameData.objects.filter(game_name=f'{game}')[0]
    parameters = {
        'game_id': game_object.game_id,
        'first': '30'
        }
    retry_count = 0
    while retry_count < 3:
        req = requests.get(get_streams_url, params=parameters, headers=auth_headers)
        status = req.status_code
        if status == requests.codes.ok:
            response = req.json()
            for ind, item in enumerate(response['data']):
                channel, created = ChannelData.objects.get_or_create(
                    channel_id=item['user_id'], 
                    defaults={
                        'channel_name':item['user_name'],
                        'channel_login':item['user_login'], 
                        'fetch_set': new_date
                        }
                    )
                Stream.objects.create(channel=channel, viewer_count=item['viewer_count'], game_played=game_object, stream_date=item['started_at'], fetch_set=new_date)
            return True
        else: #if request code not ok
            retry_count+=1
    else: #if unable to fetch data after 3 retries
        return False



def fetch_data(game):
    """Encompassing function that fetches all apis"""
    id = settings.TWITCH_CLIENT_ID
    secret = settings.TWITCH_CLIENT_SECRET
    new_date = FetchDateTimes.objects.create()
    token = check_token_valid()
    retry_count = 0
    if not token:
        fetch_access_token(id, secret,new_date)
        token = check_token_valid()
    
    bearer_token = f'Bearer {token}'
    fetch_get_games(id, bearer_token, new_date)
    fetch_streams(id, bearer_token, new_date, game)


def separate_data():
    const_chart_lengths = [2, 30, 120, 480, 2880]
    const_today = datetime.combine(datetime.today(), time(0,0,0), tzinfo=timezone.utc)
    unique_streamers = Stream.objects.annotate(todays_data=TruncDay('creation_date')).filter(todays_data=const_today).values('channel').distinct()
    for ind, streamer in enumerate(unique_streamers):
        streamer_name = ChannelData.objects.get(pk = streamer['channel']).channel_name
        streamer_qs = Stream.objects.filter(channel = streamer['channel']).order_by('creation_date').values('creation_date', 'viewer_count', 'channel_id')
        len_streamer_qs = len(streamer_qs)
        if not len_streamer_qs:
            continue
        
        streamdf = pd.DataFrame(streamer_qs)

        #compile data, then fetch last index. Reset index back to 0 for easy indexing
        minute = streamdf.resample("T", on='creation_date').mean().reset_index().iloc[[-1]].reset_index()
        OneMinuteData.objects.update_or_create(channel_name = streamer_name, channel_id = streamer['channel'], viewers_date = minute['creation_date'][0], defaults={'viewers': minute['viewer_count'][0]})

        fifteen_minute = streamdf.resample("15T", on='creation_date').mean().reset_index().iloc[[-1]].reset_index()
        FifteenMinuteData.objects.update_or_create(channel_name = streamer_name, channel_id = streamer['channel'], viewers_date = fifteen_minute['creation_date'][0], defaults={'viewers': fifteen_minute['viewer_count'][0]})

        hourly = streamdf.resample("1H", on='creation_date').mean().reset_index().iloc[[-1]].reset_index()
        OneHourData.objects.update_or_create(channel_name = streamer_name, channel_id = streamer['channel'], viewers_date = hourly['creation_date'][0], defaults={'viewers': hourly['viewer_count'][0]})

        four_hr = streamdf.resample("4H", on='creation_date').mean().reset_index().iloc[[-1]].reset_index()
        FourHourData.objects.update_or_create(channel_name = streamer_name, channel_id = streamer['channel'], viewers_date = four_hr['creation_date'][0], defaults={'viewers': four_hr['viewer_count'][0]})

        daily = streamdf.resample("D", on='creation_date').mean().reset_index().iloc[[-1]].reset_index()
        DailyData.objects.update_or_create(channel_name = streamer_name, channel_id = streamer['channel'], viewers_date = daily['creation_date'][0], defaults={'viewers': daily['viewer_count'][0]})

def clean_db():
    """
    Cleans the Streams database of old objects that have already been compiled each day
    Function will run at 00:01:00 of each new day, clearing the previous day's data
    """
    
    const_today = datetime.combine(datetime.today(), time(0,0,0), tzinfo=timezone.utc)
    Stream.objects.annotate(today = TruncDay('creation_date')).exclude(today = const_today).delete()
    return True

def del_all():
    """
    Emergency data clear
    """
    FetchDateTimes.objects.all().delete()
    ChannelData.objects.all().delete()
    GameData.objects.all().delete()
    OneHourData.objects.all().delete()
    OneMinuteData.objects.all().delete()
    FourHourData.objects.all().delete()
    DailyData.objects.all().delete()
    FifteenMinuteData.objects.all().delete()
    Stream.objects.all().delete()
    return True

    
@shared_task(bind=True)
def gather_data(self, game):
    fetch_data(game)
    separate_data()
    return True



schedule, created = IntervalSchedule.objects.get_or_create(
    every = 30,
    period = IntervalSchedule.SECONDS,
)

PeriodicTask.objects.get_or_create(
    interval = schedule,
    name = 'Fetch and compile streams',
    task = 'api.tasks.gather_data',
    args= json.dumps(['VALORANT']),
    start_time = datetime(2022, 4, 24, 2, 31, 0, tzinfo=timezone.utc)
)