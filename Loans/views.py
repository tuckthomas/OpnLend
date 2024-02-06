from django.shortcuts import render
import logging
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from uuid import uuid4

# Set up logging
logger = logging.getLogger(__name__)

def Loans(request):
    context = {
        'Global_Relationship_ID': request.session.get('Global_Relationship_ID', ''),
        'Meta_ID': request.session.get('Meta_ID', ''),
        'Unique_ID': request.session.get('Unique_ID', ''),
        'Unique_Jointly_Reported_ID': request.session.get('Unique_Jointly_Reported_ID', '')
    }
    return render(request, 'Loans.html', context)
