from django.shortcuts import render, redirect
import logging
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib .auth import authenticate, login

# Set up logging
logger = logging.getLogger(__name__)

def Register(request):
   return render(request, 'Register.html')

def Login(request):
    return render(request, 'Login.html')
