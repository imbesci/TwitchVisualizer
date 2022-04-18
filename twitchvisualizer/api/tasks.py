from celery import shared_task

@shared_task
def celerytestfunction():
    print('celery is handling this operation')
    for i in range(10):
        print(i)

