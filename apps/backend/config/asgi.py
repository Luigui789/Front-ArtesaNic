"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

# Sin DJANGO_SETTINGS_MODULE se usa la configuración base, que no activa DEBUG.
# La configuración de despliegue se definirá en su propia fase.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.base")

application = get_asgi_application()
