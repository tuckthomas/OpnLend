from django.shortcuts import render, redirect
import logging
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib .auth import authenticate, login

# Set up logging
logger = logging.getLogger(__name__)

def Profile(request):
   return render(request, 'Profile.html')

