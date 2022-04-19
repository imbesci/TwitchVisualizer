import re
import requests
import datetime
from django.conf import settings
from .models import FetchDateTimes, Security


def check_token_valid():
    """Check to see if the most recent access token. Returns the most recent valid access token or False if unsuccessful"""

    valid_token, securities_set = None, Security.objects.order_by('object_creation_date').reverse()
    i = 0
    while i<len(securities_set):
        if (securities_set[i].token_type == "bearer") and (securities_set[i].expires_in > 600):
            valid_token = securities_set[i]
            break
    else:
        return False

    return valid_token.access_token
    

def fetch_access_token():
    """Fetch new api token and log it to the database. Max retries: 3"""

    new_Date = FetchDateTimes.objects.create()
    oauth_url = 'https://id.twitch.tv/oauth2/token'
    id = settings.TWITCH_CLIENT_ID
    secret = settings.TWITCH_CLIENT_SECRET
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
            new_security_object = Security.objects.create(access_token=token, expires_in=expiry, token_type=token_type, response_code=status, fetch_set=new_Date)
            return new_security_object
        else:    
            Security.objects.create(access_token=None, expires_in=None, token_type=None, response_code=status, fetch_set=new_Date)
    else:
        raise "Unable to fetch new access token"