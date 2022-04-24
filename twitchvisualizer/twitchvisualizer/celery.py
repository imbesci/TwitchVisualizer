import os 
from django.conf import settings
from celery import Celery
import json



os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'twitchvisualizer.settings')

app = Celery('twitchvisualizer')
app.config_from_object('django.conf:settings')

app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))

