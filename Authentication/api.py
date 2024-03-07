import secrets
from ninja import Router, Form
from ninja.security import HttpBearer
from django.shortcuts import get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login, logout
from .schemas import LoginSchema, RegisterSchema, SuccessResponseSchema, ErrorResponseSchema
from UserProfiles.models import UserProfile, UserSession
from .models import CustomUser, AuthToken
from django.contrib.auth.models import User
from django.shortcuts import redirect
from urllib.parse import urlencode
from django.db import transaction

router = Router()

class TokenAuth(HttpBearer):
    def authenticate(self, request, token):
        try:
            token_obj = AuthToken.objects.get(token=token)
            return token_obj.user
        except AuthToken.DoesNotExist:
            return None

@router.post('/register/')
def register(request, payload: RegisterSchema):
    if CustomUser.objects.filter(email=payload.email).exists():
        return JsonResponse({'error': "Email already exists"}, status=400)

    with transaction.atomic():
        try:
            user = CustomUser.objects.create_user(
                email=payload.email,
                password=payload.password
            )
            # Explicitly create UserProfile here
            UserProfile.objects.create(
                user=user,
                user_first_name=payload.first_name,
                user_last_name=payload.last_name,
                user_phone_number=payload.phone_number,
                company_name=payload.company_name,
                job_title=payload.job_title
            )
            # Assuming success, redirect to login with query string
            query_string = urlencode({'email': payload.email})
            return JsonResponse({'success': True, 'redirect_url': f'/login/?{query_string}'})
        except Exception as e:
            # Detailed logging for debugging
            print(f"Failed to create user profile: {e}")
            # Return a detailed error response
            return JsonResponse({'error': "Failed to create user profile"}, status=500)

@router.post('/login/', response={200: SuccessResponseSchema, 400: ErrorResponseSchema})
def login_user(request, payload: LoginSchema):
    user = authenticate(request, username=payload.email, password=payload.password)
    if user is not None:
        login(request, user)  # Log the user in

        # Generate a new token for the user
        token = secrets.token_hex(16)
        AuthToken.objects.create(user=user, token=token)

        # Create or update the UserSession entry with the new token
        UserSession.objects.update_or_create(
            user=user,
            defaults={
                'auth_token': token,  # Assuming you've added an auth_token field to your UserSession model
                # Include any other fields you need to set or update
            }
        )

        # Prepare the response and set the HttpOnly cookie
        response = JsonResponse({
            "success": "User logged in successfully",
            "redirect_url": "/"  # Or any other data you wish to send
        })
        response.set_cookie(
            'authToken', 
            value=token, 
            httponly=True, 
            max_age=86400,  # Expires in 1 day
            samesite='Lax',  # Adjust accordingly
            secure=True  # Recommended to use with HTTPS only
        )

        return response
    else:
        return JsonResponse({"error": "Invalid credentials"}, status=400)

@router.get('/status/')
def get_authentication_status(request):
    if request.user.is_authenticated:
        user = request.user
        user_profile = UserProfile.objects.get(user=user)
        return JsonResponse({
            "isLoggedIn": True,
            "firstName": user_profile.user_first_name,
            "lastName": user_profile.user_last_name
        })
    else:
        return JsonResponse({"isLoggedIn": False})

@router.post('/logout/')
def logout_user(request):
    # Invalidate the session
    logout(request)  # Django's logout
    
    # Additionally, invalidate the token if it exists
    if 'authToken' in request.COOKIES:
        token = request.COOKIES['authToken']
        AuthToken.objects.filter(token=token).delete()
        response = JsonResponse({"success": "User logged out successfully", "redirect_url": "/login"})
        response.delete_cookie('authToken')  # Remove the token cookie
        return response
    else:
        return JsonResponse({"error": "User is not authenticated"}, status=401)
