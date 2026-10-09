"""Operaciones de cuentas con reglas del negocio (RF-004).

El rol lo decide el servidor según la operación invocada; ningún dato de la
petición lo determina.
"""

from django.contrib.auth import authenticate
from django.db import IntegrityError, transaction

from .models import Rol, Usuario
from .phone import normalizar_telefono


class TelefonoYaRegistrado(Exception):
    """Ya existe una cuenta con ese teléfono, una vez normalizado."""


class CredencialesInvalidas(Exception):
    """Teléfono o contraseña incorrectos, o cuenta inactiva: no se distinguen."""


class CuentaDeAdministracion(Exception):
    """Credenciales correctas de una cuenta que opera en Django Admin, no en la API."""


def registrar_comprador(*, nombre: str, telefono: str, password: str) -> Usuario:
    return _registrar(Rol.COMPRADOR, nombre=nombre, telefono=telefono, password=password)


def registrar_artesano(*, nombre: str, telefono: str, password: str) -> Usuario:
    """Crea la cuenta del artesano.

    El taller, su perfil y su aprobación (RF-008, RF-013) pertenecen a la fase
    siguiente: crear la cuenta no aprueba ningún taller.
    """
    return _registrar(Rol.ARTESANO, nombre=nombre, telefono=telefono, password=password)


def _registrar(rol: Rol, *, nombre: str, telefono: str, password: str) -> Usuario:
    telefono = normalizar_telefono(telefono)
    if Usuario.objects.filter(telefono=telefono).exists():
        raise TelefonoYaRegistrado
    try:
        with transaction.atomic():
            return Usuario.objects.create_user(
                telefono=telefono, password=password, nombre=nombre, rol=rol
            )
    except IntegrityError:
        # Dos registros simultáneos del mismo teléfono: la restricción única decide.
        if Usuario.objects.filter(telefono=telefono).exists():
            raise TelefonoYaRegistrado from None
        raise


def autenticar(request, *, telefono: str, password: str) -> Usuario:
    """Verifica las credenciales con los backends de Django y la regla de acceso a la API."""
    usuario = authenticate(request, telefono=telefono, password=password)
    if usuario is None:
        # El backend de Django también rechaza aquí las cuentas inactivas.
        raise CredencialesInvalidas
    if not usuario.puede_usar_api:
        raise CuentaDeAdministracion
    return usuario
