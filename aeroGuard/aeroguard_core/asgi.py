import os
import django
from django.core.asgi import get_asgi_application

# 1. Setup Django first
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aeroguard_core.settings')
django.setup()

# 2. Import Channels tools
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path # <--- CHANGED THIS IMPORT
from core.consumers import UnitConsumer

# 3. Define the Application
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter([
        # regex r"ws/units/?$" means:
        # "ws/units" is okay.
        # "ws/units/" is also okay.
        re_path(r"ws/units/?$", UnitConsumer.as_asgi()),
    ]),
})