from django.shortcuts import redirect
from django.urls import reverse
from django.http import HttpRequest, JsonResponse
import logging

class RedirectMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.logger = logging.getLogger(__name__)

    def __call__(self, request: HttpRequest):
        # Log the request path and authentication status for debugging with print statements
        print(f"[RedirectMiddleware] Request path: {request.path}")
        print(f"[RedirectMiddleware] User authenticated: {request.user.is_authenticated}")

        # Directly pass through requests to /api and /admin without redirection logic
        if request.path.startswith('/api') or request.path.startswith('/admin'):
            print("[RedirectMiddleware] Passing through /api or /admin request without redirection.")
            response = self.get_response(request)
            print("[RedirectMiddleware] Response for /api or /admin request processed.")
            print("[RedirectMiddleware] Final Request processing completed for /api or /admin.")
            return response

        # For non-API and non-admin paths, check authentication
        if not request.user.is_authenticated:
            # Define paths that do not require redirection
            excluded_paths = [
                reverse('Login'),  # Assuming you have a named URL 'Login'
                reverse('Register'),  # Assuming you have a named URL 'Register'
                '/admin/login/',  # Admin login path
            ]

            # Redirect unauthenticated users to the login page if the request path is not in excluded_paths
            if not any(request.path.startswith(path) for path in excluded_paths):
                print("[RedirectMiddleware] Redirecting unauthenticated user to Login.")
                return redirect('Login')  # Assuming you have a named URL 'Login'

        # If none of the above conditions are met, just process the request normally
        print("[RedirectMiddleware] Processing non-/api or /admin request normally.")
        response = self.get_response(request)
        print("[RedirectMiddleware] Normal request processing completed for non-/api or /admin.")
        
        # Return the response
        return response