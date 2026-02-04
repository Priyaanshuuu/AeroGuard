import os 
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE' , 'aeroguard_core.settings')

app = Celery('aeroguard_core')

app.config_from_object('django.conf:settings' , namespace = 'CELERY')

app.autodiscover_tasks()

@app.task(bind = True)
def debug_task(self):
    print(f'Request: {self.request!r}')