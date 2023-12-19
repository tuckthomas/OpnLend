from django.urls import path
from . import views

urlpatterns = [
    # ... other URL patterns
    path('individual_profile/<uuid:uuid>/', views.individual_profile, name='individual_profile'),
    path('business_profile/<uuid:uuid>/', views.business_profile, name='business_profile'),
]
