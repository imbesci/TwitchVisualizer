from .models import Leads

def testfunc():
    Leads.objects.create(name="test", email="test@gmail.com", message="tester")
    return True
