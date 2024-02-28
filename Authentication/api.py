from ninja import Router
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .schemas import RegisterSchema

router = Router()

@router.post('/api/register', response=RegisterSchema)
def register(request):
    data = request.json

    # Validate user data
    if  not data.get('first_name') or not data.get('last_name') or not data.get(' email') or not data.get('password') or not data.get('password_repeat'):
        return Response(
            status=400,
            json={
                'error': 'Missing required fields'
            }
        )

    if data.get('password') != data.get('password_repeat'):
        return Response(
            status=400,
            json={
                'error': 'Passwords do not match'
            }
         )

    # Check if user already exists
    if User.objects.filter(email=data.get('email')).exists():
        return Response(
            status=400,
            json={
                'error': 'Email already exists'
            }
        )

    # Create new user
    user = User.objects.create_user(
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        email=data.get('email'),
        password=data.get('password')
    )

    # Authenticate user
    auth_user = authenticate(username=data.get('email'),  password=data.get('password'))

    if auth_user is not None:
        return Response(
            status=200,
            json={
                'success': 'User created successfully'
            }
        )
    else:
        return Response(
            status=400,
            json={
                'error': 'Invalid credentials'
            }
        )

@router.post('/api/login')
def login(request):
    data = request.json

    # Validate user data
    if not data. get('email') or not data.get('password'):
        return Response(
            status=400,
            json={
                'error': 'Missing required fields'
            }
        )

    # Authenticate the user
    user = authenticate(username=data.get('email'), password=data.get('password'))

    if user is not None:
        # Log the user in
        login(request, user)

        return Response(
            status=200,
            json={
                'success': 'User logged in successfully'
            } 
        )
    else:
        return Response(
            status=400,
            json={
                'error': 'Invalid credentials'
            }
        )