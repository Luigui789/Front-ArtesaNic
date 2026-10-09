"""Suite de pruebas. Usa el PostgreSQL de .env: Django crea y destruye su base test_*."""

import os

# Clave ficticia para que las pruebas no dependan de la clave real del entorno.
os.environ.setdefault("DJANGO_SECRET_KEY", "clave-exclusiva-de-pruebas-sin-uso-real")

from .base import *  # noqa: E402, F403

# Las pruebas crean muchas cuentas; el hash real (PBKDF2, de base) haría la suite muy lenta.
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]
