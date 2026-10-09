"""Desarrollo local: Django en el host, PostgreSQL de Compose y el frontend en Vite.

Solo cambia valores por defecto; cualquier variable de .env o del entorno los sustituye.
"""

from .base import *  # noqa: F403
from .base import env_bool, env_list

DEBUG = env_bool("DJANGO_DEBUG", default=True)
ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1")

# Servidor de desarrollo de Vite.
FRONTEND_ORIGINS = env_list(
    "DJANGO_FRONTEND_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
)
CORS_ALLOWED_ORIGINS = FRONTEND_ORIGINS
CSRF_TRUSTED_ORIGINS = FRONTEND_ORIGINS

# HTTP sin TLS: una cookie Secure no se guardaría en todos los navegadores.
SECURE_COOKIES = env_bool("DJANGO_SECURE_COOKIES", default=False)
SESSION_COOKIE_SECURE = SECURE_COOKIES
CSRF_COOKIE_SECURE = SECURE_COOKIES
REFRESH_COOKIE_SECURE = SECURE_COOKIES
