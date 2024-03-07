import os
from pathlib import Path
from django.conf import settings
from django.core.asgi import get_asgi_application

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

print(f"BASE_DIR: {BASE_DIR}")


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'GENERATE_SECRET_KEY_AND_INPUT_IT_HERE'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Host and Encryption Settings
ALLOWED_HOSTS = ['[ENTER ALLOWED HOSTS HERE]']
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# Security settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

# Session Settings
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_COOKIE_SAMESITE = 'Lax'

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'Authentication.apps.AuthenticationConfig',
    'Dashboard',
    'Global_Relationships',
    'Financial_Manager',
    'Loans',
    'Application_Portal',
    'Underwriting',
    'Portfolio_Management',
    'UserProfiles',
    'Settings',
    'sslserver',
    'ninja',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django_user_agents.middleware.UserAgentMiddleware',
    'Authentication.middleware.RedirectMiddleware'
]

ROOT_URLCONF = 'OpnLend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'OpnLend.settings')

# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'ENTER_DATABASE_NAME_HERE',
        'USER': 'ENTER_DATABASE_USER_HERE',
        'PASSWORD': 'ENTER_DATABASE_PASSWORD_HERE',
        'HOST': 'ENTER_DATABASE_HOST_IP/URL HERE',
        'PORT': 'ENTER_DATABASE_PORT_HERE_IF_LOCALLY_HOSTED',
    }
}

# Authentication of user model
AUTH_USER_MODEL = 'Authentication.CustomUser'


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 12,  # Ensure your desired minimum length
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'

# The absolute path to the directory where collectstatic will collect static files for deployment.
STATIC_ROOT = os.path.join(BASE_DIR, 'collected_static')

# This is an additional locations where Django will look for static files, in addition to each app's "static" directory.
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

# This is not properly configured yet while still in development; I continue to use my development server, i.e. Django
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {process:d} {thread:d} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'DEBUG',  # Change the level to DEBUG
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(settings.BASE_DIR, 'info.log'),  # Use a different log file
            'maxBytes': 1024*1024*5,  # 5 MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
        'console': {
            'level': 'DEBUG',  # Change the level to DEBUG
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
        'OpnLend': {
            'handlers': ['file', 'console'],
            'level': 'DEBUG',  # Change the level to DEBUG
        },
    },
}

