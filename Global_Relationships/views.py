from django.shortcuts import render, redirect
import logging
import traceback
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.http import require_http_methods, require_POST
from uuid import uuid4
from django.utils import timezone
from datetime import datetime

# Set up logging
logger = logging.getLogger(__name__)

# Renders the Relationship.html webpage with session data
def global_relationships(request):
    return render(request, 'Relationships.html')

# Refresh CSRF Token
def refresh_csrf_token(request):
    # Get a new CSRF token
    new_csrf_token = get_token(request)

    # Return the new CSRF token as a JSON response
    return JsonResponse({'csrf_token': new_csrf_token})
