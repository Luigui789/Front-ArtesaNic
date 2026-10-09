"""Apoyo compartido por las pruebas de cuentas y sesión."""

from django.core.cache import cache
from rest_framework.test import APIClient, APITestCase

from apps.accounts.models import Rol, Usuario

PASSWORD = "Tejido-de-Masaya-2026"

# Rutas escritas a mano a propósito: las pruebas verifican el contrato publicado.
URL_CSRF = "/api/v1/auth/csrf/"
URL_REGISTRO_COMPRADOR = "/api/v1/auth/registro/comprador/"
URL_REGISTRO_ARTESANO = "/api/v1/auth/registro/artesano/"
URL_LOGIN = "/api/v1/auth/login/"
URL_REFRESCAR = "/api/v1/auth/refrescar/"
URL_LOGOUT = "/api/v1/auth/logout/"
URL_PERFIL = "/api/v1/auth/perfil/"


def crear_usuario(
    telefono="85551234",
    *,
    rol=Rol.COMPRADOR,
    nombre="Ana Lucía Delgado",
    password=PASSWORD,
    **extra,
):
    return Usuario.objects.create_user(
        telefono=telefono, password=password, nombre=nombre, rol=rol, **extra
    )


class AuthAPITestCase(APITestCase):
    """Cliente que exige CSRF como un navegador; APIClient lo omite por defecto."""

    def setUp(self):
        cache.clear()  # contadores de la limitación de intentos
        self.client = APIClient(enforce_csrf_checks=True)

    def obtener_csrf(self) -> str:
        return self.client.get(URL_CSRF).json()["csrf_token"]

    def post_con_csrf(self, url, data=None, **extra):
        return self.client.post(
            url, data, format="json", HTTP_X_CSRFTOKEN=self.obtener_csrf(), **extra
        )

    def iniciar_sesion(self, telefono="85551234", password=PASSWORD) -> str:
        respuesta = self.post_con_csrf(URL_LOGIN, {"telefono": telefono, "password": password})
        self.assertEqual(respuesta.status_code, 200, respuesta.content)
        return respuesta.json()["access"]

    def con_token(self, access: str) -> None:
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
