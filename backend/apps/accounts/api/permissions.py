"""Autorización por rol y por propietario (RF-004, RNF-004).

El servidor es la única autoridad: el selector de vista del prototipo no concede
permisos. Una petición anónima recibe 401; una autenticada sin el rol, 403.
"""

from rest_framework.exceptions import NotFound
from rest_framework.permissions import BasePermission

from ..models import Rol


class _TieneRol(BasePermission):
    rol: Rol

    def has_permission(self, request, view):
        usuario = request.user
        return bool(usuario and usuario.is_authenticated and usuario.rol == self.rol)


class EsComprador(_TieneRol):
    rol = Rol.COMPRADOR
    message = "Esta operación es exclusiva de las cuentas de comprador."


class EsArtesano(_TieneRol):
    rol = Rol.ARTESANO
    message = "Esta operación es exclusiva de las cuentas de artesano."


class EsPropietario(BasePermission):
    """Solo una parte legítima del objeto accede a él.

    Cada modelo protegido declara su pertenencia con ``pertenece_a(usuario) -> bool``
    (por ejemplo, un pedido pertenece a su comprador y al artesano de su taller).
    Un objeto ajeno responde 404 y no 403, para no revelar que existe (contrato de
    API, sección 1.9). Las vistas deben además limitar su queryset al usuario;
    este permiso es la comprobación por objeto que se mantiene aunque no lo hagan.
    """

    def has_object_permission(self, request, view, obj):
        if obj.pertenece_a(request.user):
            return True
        raise NotFound()
