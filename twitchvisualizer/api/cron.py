from .models import Leads
from .tasks import celerytestfunction


def testfunc():
    celeryworker = celerytestfunction.delay().get()
    Leads.objects.create(name="test", email="test@gmail.com", message="tester")
    return True
