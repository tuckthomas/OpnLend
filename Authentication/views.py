from django.shortcuts import render, redirect
from django.contrib .auth import authenticate, login

def register(request):
   return render(request, 'registration-and-login/register.html')

def login(request):
    return render(request, 'registration-and-login/login.html')