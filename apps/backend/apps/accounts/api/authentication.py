"""Autenticación de la API: token de acceso en ``Authorization: Bearer`` (ADR-003)."""

from drf_spectacular.contrib.rest_framework_simplejwt import SimpleJWTScheme
from rest_framework import exceptions
from rest_framework_simplejwt import authentication as simplejwt_authentication

MENSAJE_SESION_INVALIDA = "La sesión no es válida o expiró. Inicia sesión de nuevo."


def puede_autenticarse(usuario) -> bool:
    """Regla única de acceso: la aplican el token de acceso y la renovación (SIMPLE_JWT)."""
    return usuario is not None and usuario.puede_usar_api


class JWTAuthentication(simplejwt_authentication.JWTAuthentication):
    """Valida el token de acceso y vuelve a comprobar la cuenta en cada petición.

    Una cuenta desactivada pierde el acceso en su siguiente petición, aunque su
    token no haya caducado. Todos los fallos responden el mismo 401 sin detalles
    internos (simplejwt incluiría las clases de token probadas).
    """

    def get_validated_token(self, raw_token):
        try:
            return super().get_validated_token(raw_token)
        except exceptions.AuthenticationFailed as exc:
            raise exceptions.AuthenticationFailed(
                MENSAJE_SESION_INVALIDA, code="sesion_invalida"
            ) from exc

    def get_user(self, validated_token):
        try:
            usuario = super().get_user(validated_token)
        except exceptions.AuthenticationFailed as exc:
            raise exceptions.AuthenticationFailed(
                MENSAJE_SESION_INVALIDA, code="sesion_invalida"
            ) from exc
        if not puede_autenticarse(usuario):
            raise exceptions.AuthenticationFailed(MENSAJE_SESION_INVALIDA, code="sesion_invalida")
        return usuario


class JWTAuthenticationScheme(SimpleJWTScheme):
    """Esquema OpenAPI de la clase anterior (drf-spectacular solo reconoce la original)."""

    target_class = JWTAuthentication
