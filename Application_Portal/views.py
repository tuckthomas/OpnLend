from django.shortcuts import render
import logging
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from uuid import uuid4

# Set up logging
logger = logging.getLogger(__name__)

def LoanApplicationPortal(request):
    return render(request, 'Loan-Application-Portal.html')