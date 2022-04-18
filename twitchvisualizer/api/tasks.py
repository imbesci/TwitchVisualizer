from twitchvisualizer.celery import app

app.task(name='testfunction')
def celerytestfunction():
    print('celery is handling this operation')
    return True