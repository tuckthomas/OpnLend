from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser
from UserProfiles.models import UserSession

@receiver(post_save, sender=CustomUser)
def create_user_session(sender, instance, created, **kwargs):
    if created:
        UserSession.objects.create(user=instance)

