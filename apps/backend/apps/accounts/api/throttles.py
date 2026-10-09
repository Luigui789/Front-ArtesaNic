from collections.abc import Mapping

from django.core.exceptions import ValidationError
from rest_framework.throttling import SimpleRateThrottle

from ..phone import normalizar_telefono


class LoginPorTelefonoThrottle(SimpleRateThrottle):
    """Limita los intentos de acceso a una misma cuenta aunque lleguen desde varias IP.

    Complementa el límite por IP (``ScopedRateThrottle``, alcance ``login``).
    """

    scope = "login_telefono"

    def get_cache_key(self, request, view):
        datos = request.data
        if not isinstance(datos, Mapping):
            return None
        try:
            telefono = normalizar_telefono(datos.get("telefono"))
        except ValidationError:
            return None
        return self.cache_format % {"scope": self.scope, "ident": telefono}
