import os
from django.core.wsgi import get_wsgi_application
from whitenoise import WhiteNoise

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'OpnLend.settings')

application = get_wsgi_application()
application = WhiteNoise(application, root=os.path.join(BASE_DIR, 'staticfiles'))
application.add_files(os.path.join(BASE_DIR, 'static'), prefix='static/')