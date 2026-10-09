"""Cuenta de usuario (RF-004, RF-013)."""

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.validators import RegexValidator
from django.db import models
from django.db.models import Q
from django.utils import timezone

from .managers import UsuarioManager
from .phone import MENSAJE_FORMATO, PATRON_TELEFONO_NORMALIZADO


class Rol(models.TextChoices):
    """Rol de negocio, independiente de los privilegios internos de Django.

    ``is_staff`` (entrar a Django Admin) e ``is_superuser`` (todos los permisos)
    son privilegios técnicos: ser administrador de plataforma no los concede.
    """

    COMPRADOR = "comprador", "Comprador"
    ARTESANO = "artesano", "Artesano"
    ADMINISTRADOR = "administrador", "Administrador"


# Roles de la plataforma pública: se registran por la API y operan en ella.
# La administración trabaja en Django Admin (RF-013, ADR-007).
ROLES_PUBLICOS = (Rol.COMPRADOR, Rol.ARTESANO)


class Usuario(AbstractBaseUser, PermissionsMixin):
    telefono = models.CharField(
        "teléfono",
        max_length=8,
        unique=True,
        validators=[RegexValidator(PATRON_TELEFONO_NORMALIZADO, MENSAJE_FORMATO)],
        help_text="Identificador de acceso: 8 dígitos, sin prefijo ni separadores.",
        error_messages={"unique": "Ya existe una cuenta con este teléfono."},
    )
    nombre = models.CharField("nombre", max_length=150)
    rol = models.CharField("rol", max_length=20, choices=Rol.choices)
    is_active = models.BooleanField(
        "activa",
        default=True,
        help_text="Una cuenta inactiva no inicia sesión y sus sesiones dejan de ser válidas.",
    )
    is_staff = models.BooleanField(
        "acceso a Django Admin",
        default=False,
        help_text="Privilegio interno de Django. Solo para cuentas con rol administrador.",
    )
    creado_en = models.DateTimeField("creada en", default=timezone.now, editable=False)

    objects = UsuarioManager()

    USERNAME_FIELD = "telefono"
    REQUIRED_FIELDS = ["nombre"]

    class Meta:
        verbose_name = "usuario"
        verbose_name_plural = "usuarios"
        constraints = [
            # Solo la forma canónica: la unicidad del teléfono no depende del formato.
            models.CheckConstraint(
                condition=Q(telefono__regex=PATRON_TELEFONO_NORMALIZADO),
                name="usuario_telefono_normalizado",
                violation_error_message=MENSAJE_FORMATO,
            ),
            models.CheckConstraint(
                condition=Q(rol__in=Rol.values),
                name="usuario_rol_valido",
            ),
            # Una cuenta de comprador o artesano nunca tiene privilegios internos.
            models.CheckConstraint(
                condition=Q(is_staff=False) | Q(rol=Rol.ADMINISTRADOR),
                name="usuario_staff_requiere_rol_administrador",
                violation_error_message=(
                    "Solo una cuenta con rol administrador puede acceder a Django Admin."
                ),
            ),
            models.CheckConstraint(
                condition=Q(is_superuser=False) | Q(rol=Rol.ADMINISTRADOR),
                name="usuario_superusuario_requiere_rol_administrador",
                violation_error_message=(
                    "Solo una cuenta con rol administrador puede ser superusuario."
                ),
            ),
        ]

    def __str__(self):
        return f"{self.nombre} ({self.telefono})"

    @property
    def puede_usar_api(self) -> bool:
        """Cuenta activa de comprador o artesano: la que puede autenticarse en la API."""
        return self.is_active and self.rol in ROLES_PUBLICOS
