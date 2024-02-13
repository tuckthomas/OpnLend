from django.db import models
from django.conf import settings

class UserSession(models.Model):
    User = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="User_Sessions")
    Global_Relationship_ID = models.CharField(max_length=255)
    Meta_ID = models.CharField(max_length=255)
    Unique_ID = models.CharField(max_length=255)
    # Include any additional fields as necessary
    # Will likely add the foreign key relationship ID for for personal accounts

    def __str__(self):
        return f"Session for {self.user.email}"