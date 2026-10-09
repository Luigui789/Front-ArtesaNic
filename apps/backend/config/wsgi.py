"""
WSGI config for config project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

# Sin DJANGO_SETTINGS_MODULE se usa la configuración base, que no activa DEBUG.
# La configuración de despliegue se definirá en su propia fase.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.base")

application = get_wsgi_application()
