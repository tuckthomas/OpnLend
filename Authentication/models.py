# Import necessary modules from Django
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _

# Define a custom user manager
class CustomUserManager(BaseUserManager):
    # Function to create a standard user
    def create_user(self, email, password=None, **extra_fields):
        # Check if email is provided
        if not email:
            raise ValueError(_('The Email must be set'))  # Raise error if email is not provided
        email = self.normalize_email(email)  # Normalize the email address by lowercasing the domain part of it
        user = self.model(email=email, **extra_fields)  # Create a user object
        user.set_password(password)  # Set user password
        user.save(using=self._db)  # Save the user object
        return user  # Return the user object

    # Function to create a superuser
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)  # Set 'is_staff' as True by default
        extra_fields.setdefault('is_superuser', True)  # Set 'is_superuser' as True by default

        # Check if 'is_staff' and 'is_superuser' are set as True
        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))  # Raise error if 'is_staff' is not True
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))  # Raise error if 'is_superuser' is not True

        return self.create_user(email, password, **extra_fields)  # Return the superuser object

# Define a custom user model
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)  # Email field
    is_staff = models.BooleanField(default=False)  # Boolean field to check if user is staff
    is_active = models.BooleanField(default=True)  # Boolean field to check if user is active

    objects = CustomUserManager()  # Assign the custom user manager to 'objects'

    USERNAME_FIELD = 'email'  # Use email as the username field
    REQUIRED_FIELDS = []  # No required fields

    # String representation of the user
    def __str__(self):
        return self.email
