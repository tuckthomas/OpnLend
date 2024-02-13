from django.apps import AppConfig

class AuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Authentication'

    def ready(self):
        # This imports the signals to ensure they are connected
        import Authentication.signals
