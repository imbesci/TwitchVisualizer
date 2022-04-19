from .tasks import celerytestfunction
from .models import FetchDateTimes

def testfunc():
    FetchDateTimes.objects.create()
