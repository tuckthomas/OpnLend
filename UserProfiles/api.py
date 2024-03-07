from ninja import Router
from django.http import HttpRequest, JsonResponse
import json
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from ninja.security import django_auth
from django.conf import settings
from .models import UserSession
from Global_Relationships.models import GlobalRelationship, BusinessAccounts, PersonalAccounts
from .schemas import UserSessionResponse, UpdateUserSessionSchema, UpdateUserSessionBusinessSchema, UpdateUserSessionPersonalSchema
from django.db.models import Q
from pydantic import ValidationError
from .utils import fetch_user_session

router = Router()

# Endpoint /api/user-profiles/update-session/
@router.post("/update_session/", auth=django_auth)
def update_user_session(request, data: UpdateUserSessionSchema):
    user = request.user  # Access the authenticated user

    # Extracting data from the schema instance
    global_relationship_id = data.Global_Relationship_ID
    meta_id = data.Meta_ID
    business_unique_id = data.Business_Unique_ID
    personal_unique_id = data.Personal_Unique_ID

    # Logging received data for debugging
    print("User ID:", user.id) 
    print("Received Data:")
    print("Global Relationship ID:", global_relationship_id)
    print("Meta ID:", meta_id)
    print("Business Unique ID:", business_unique_id)
    print("Personal Unique ID:", personal_unique_id)

    try:
        # Assuming user_session is related to 'user' and is unique per user
        user_session, created = UserSession.objects.get_or_create(user=user)
        
        # Set session values
        user_session.Global_Relationship_ID = global_relationship_id
        user_session.Meta_ID = meta_id
        user_session.Business_Unique_ID = business_unique_id
        user_session.Personal_Unique_ID = personal_unique_id
        
        user_session.save()

        # Return updated session data
        return {
            "success": True,
            "message": "User Session updated",
            "Global_Relationship_ID": str(global_relationship_id),
            "Meta_ID": str(meta_id),
            "Business_Unique_ID": str(business_unique_id),
            "Personal_Unique_ID": str(personal_unique_id)
        }

    except Exception as e:
        print("Error:", e)
        return {"error": str(e)}, 500

# Endpoint /api/user-profiles/update-business/
@router.post("/update_business/", auth=django_auth)
def update_user_session_business(request, data: UpdateUserSessionBusinessSchema):
    user = request.user  # Access the authenticated user

    # Extracting data from the schema instance
    global_relationship_id = data.Global_Relationship_ID
    meta_id = data.Meta_ID
    business_unique_id = data.Business_Unique_ID

    # Logging received data for debugging
    print("User ID:", user.id) 
    print("Received Data:")
    print("Global Relationship ID:", global_relationship_id)
    print("Meta ID:", meta_id)
    print("Business Unique ID:", business_unique_id)

    try:
        # Assuming user_session is related to 'user' and is unique per user
        user_session, created = UserSession.objects.get_or_create(user=user)
        
        # Set session values
        user_session.Business_Unique_ID = business_unique_id
        
        user_session.save()

        # Return updated session data
        return {
            "success": True,
            "message": "User Session updated",
            "Global_Relationship_ID": str(global_relationship_id),
            "Meta_ID": str(meta_id),
            "Business_Unique_ID": str(business_unique_id),
        }

    except Exception as e:
        print("Error:", e)
        return {"error": str(e)}, 500

# Endpoint /api/user-profiles/update-business/
@router.post("/update_personal/", auth=django_auth)
def update_user_session_business(request, data: UpdateUserSessionPersonalSchema):
    user = request.user  # Access the authenticated user

    # Extracting data from the schema instance
    global_relationship_id = data.Global_Relationship_ID
    meta_id = data.Meta_ID
    personal_unique_id = data.Personal_Unique_ID

    # Logging received data for debugging
    print("User ID:", user.id) 
    print("Received Data:")
    print("Global Relationship ID:", global_relationship_id)
    print("Meta ID:", meta_id)
    print("Personal Unique ID:", personal_unique_id)

    try:
        # Assuming user_session is related to 'user' and is unique per user
        user_session, created = UserSession.objects.get_or_create(user=user)
        
        # Set session values
        user_session.Global_Relationship_ID = global_relationship_id
        user_session.Meta_ID = meta_id
        user_session.Personal_Unique_ID = personal_unique_id
        
        user_session.save()

        # Return updated session data
        return {
            "success": True,
            "message": "User Session updated",
            "Global_Relationship_ID": str(global_relationship_id),
            "Meta_ID": str(meta_id),
            "Personal_Unique_ID": str(personal_unique_id)
        }

    except Exception as e:
        print("Error:", e)
        return {"error": str(e)}, 500

# Endpoint /api/user-profiles/user-session/get
@router.get("/user-session/get", response=UserSessionResponse, auth=django_auth)
def get_user_session(request):
    user = request.auth
    print("User ID:", user.id) 
    try:
        user_session = UserSession.objects.filter(user=user).first()
        print("User session found:", user_session)
        if user_session:
            return UserSessionResponse(
                Global_Relationship_ID=user_session.Global_Relationship_ID,
                Meta_ID=user_session.Meta_ID,
                Business_Unique_ID=user_session.Business_Unique_ID,
                Personal_Unique_ID=user_session.Personal_Unique_ID
            )
        else:
            return {"error": "User session not found"}, 404
    except Exception as e:
        return {"error": str(e)}, 500
