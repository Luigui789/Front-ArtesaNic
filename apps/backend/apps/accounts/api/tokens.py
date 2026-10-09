"""Emisión, renovación y revocación de tokens, y su cookie HttpOnly (ADR-003, ADR-007).

El token de acceso viaja en el cuerpo de la respuesta y el frontend lo guarda
solo en memoria. El de renovación viaja únicamente en la cookie: nunca en el
cuerpo, para que el código del navegador no pueda leerlo.
"""

from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import exceptions
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken


class SesionInvalida(Exception):
    """El token de renovación no sirve: caducó, fue revocado o su cuenta ya no tiene acceso."""


def emitir_tokens(usuario) -> tuple[str, str]:
    """Inicia una sesión: devuelve ``(acceso, renovación)``."""
    renovacion = RefreshToken.for_user(usuario)
    return str(renovacion.access_token), str(renovacion)


def renovar_tokens(token_renovacion: str) -> tuple[str, str]:
    """Emite un acceso nuevo y rota la renovación; la anterior queda revocada."""
    serializer = TokenRefreshSerializer(data={"refresh": token_renovacion})
    try:
        serializer.is_valid(raise_exception=True)
    except (TokenError, exceptions.APIException, ObjectDoesNotExist) as exc:
        raise SesionInvalida from exc
    return serializer.validated_data["access"], serializer.validated_data["refresh"]


def revocar_renovacion(token_renovacion: str) -> None:
    """Añade el token a la lista de revocados. Si ya no era válido, no hay nada que revocar."""
    try:
        RefreshToken(token_renovacion).blacklist()
    except TokenError:
        pass


def leer_cookie_renovacion(request) -> str | None:
    return request.COOKIES.get(settings.REFRESH_COOKIE_NAME) or None


def guardar_cookie_renovacion(response, token_renovacion: str) -> None:
    response.set_cookie(
        settings.REFRESH_COOKIE_NAME,
        token_renovacion,
        max_age=int(api_settings.REFRESH_TOKEN_LIFETIME.total_seconds()),
        path=settings.REFRESH_COOKIE_PATH,
        secure=settings.REFRESH_COOKIE_SECURE,
        httponly=True,
        samesite=settings.REFRESH_COOKIE_SAMESITE,
    )


def eliminar_cookie_renovacion(response) -> None:
    response.delete_cookie(
        settings.REFRESH_COOKIE_NAME,
        path=settings.REFRESH_COOKIE_PATH,
        samesite=settings.REFRESH_COOKIE_SAMESITE,
    )
