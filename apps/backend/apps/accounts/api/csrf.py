"""Protección CSRF de los endpoints que emiten o leen la cookie de renovación (ADR-003, ADR-007)."""

from rest_framework.authentication import CSRFCheck
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission

MENSAJE_CSRF = "Falta el token CSRF o no es válido. Solicita uno en /api/v1/auth/csrf/."


class CSRFRequerido(BasePermission):
    """Exige la cabecera ``X-CSRFToken`` junto con la cookie ``csrftoken``.

    DRF exime sus vistas del middleware CSRF porque la autenticación por cabecera
    no lo necesita. Estas vistas sí: el navegador envía la cookie de renovación
    por su cuenta. Se aplica la misma verificación de Django (token y origen).
    """

    def has_permission(self, request, view):
        verificacion = CSRFCheck(lambda _request: None)
        verificacion.process_request(request)
        if verificacion.process_view(request, None, (), {}):
            raise PermissionDenied(MENSAJE_CSRF, code="csrf_invalido")
        return True
