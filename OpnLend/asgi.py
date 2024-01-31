"""
ASGI config for OpnLend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

# OpnLend/asgi.py

import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'OpnLend.settings')

# Define the ASGI application for the entire project
django_application = get_asgi_application()

# Your ASGI application for the entire project should be sufficient
application = django_application