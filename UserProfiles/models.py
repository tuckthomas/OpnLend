from django.db import models
from django.conf import settings
from django.core.validators import RegexValidator, MinLengthValidator, MaxLengthValidator
from django.contrib.contenttypes.models import ContentType

class UserSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="User_Sessions")
    Global_Relationship_ID = models.CharField(max_length=255, null=True, blank=True, db_column='Global_Relationship_ID')
    Meta_ID = models.CharField(max_length=255, null=True, blank=True)
    Business_Unique_ID = models.CharField(max_length=255, null=True, blank=True)
    Personal_Unique_ID = models.CharField(max_length=255, null=True, blank=True)
    # Server-Side Session Storage for enhanced auditing and security benefits
    auth_token = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return f"Session for {self.user.email}"

    class Meta:
        db_table = 'User_Session_Storage'

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    user_first_name = models.CharField(max_length=255, null=False, blank=False)
    user_middle_name = models.CharField(max_length=255, null=True, blank=True)
    user_last_name = models.CharField(max_length=255, null=False, blank=False)
    user_phone_number = models.CharField(
        max_length=15,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )
        ],
        null=True, blank=True
    )
    company_name = models.CharField(max_length=255, blank=True, null=True)
    job_title = models.CharField(max_length=255, blank=True, null=True)
    # Include any additional fields as necessary

    def __str__(self):
        return self.user.email

    class Meta:
        db_table = 'User_Profile'
