from django.http import HttpRequest, JsonResponse
import json
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from ninja.security import django_auth
from django.conf import settings
from .models import UserSession
from Global_Relationships.models import GlobalRelationship, BusinessAccounts, PersonalAccounts
from .schemas import UserSessionResponse
from django.db.models import Q
from pydantic import ValidationError

def fetch_user_session(user):
    print("User ID:", user.id)
    user_session = UserSession.objects.filter(user=user).first()
    print("User session found:", user_session)
    if user_session:
        return {
            "Global_Relationship_ID": user_session.Global_Relationship_ID,
            "Meta_ID": user_session.Meta_ID,
            "Business_Unique_ID": user_session.Business_Unique_ID,
            "Personal_Unique_ID": user_session.Personal_Unique_ID
        }
    else:
        return None