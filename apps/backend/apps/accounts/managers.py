from django.contrib.auth.base_user import BaseUserManager

from .phone import normalizar_telefono


class UsuarioManager(BaseUserManager):
    """Crea cuentas con el teléfono normalizado y la contraseña con hash de Django."""

    use_in_migrations = True

    def _create_user(self, telefono, password, **extra_fields):
        usuario = self.model(telefono=normalizar_telefono(telefono), **extra_fields)
        # Sin contraseña, set_password deja la cuenta con una contraseña inutilizable.
        usuario.set_password(password)
        usuario.save(using=self._db)
        return usuario

    def create_user(self, telefono, password=None, **extra_fields):
        if not extra_fields.get("rol"):
            raise ValueError("Toda cuenta necesita un rol.")
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(telefono, password, **extra_fields)

    def create_superuser(self, telefono, password=None, **extra_fields):
        """Cuenta técnica de mantenimiento (``createsuperuser``).

        No es la vía para crear administradores de plataforma: esos se crean con
        rol administrador y solo los permisos que necesitan (docs/arquitectura.md).
        """
        from .models import Rol

        extra_fields.setdefault("rol", Rol.ADMINISTRADOR)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if extra_fields["rol"] != Rol.ADMINISTRADOR:
            raise ValueError("Un superusuario debe tener rol administrador.")
        if extra_fields["is_staff"] is not True:
            raise ValueError("Un superusuario debe tener is_staff=True.")
        if extra_fields["is_superuser"] is not True:
            raise ValueError("Un superusuario debe tener is_superuser=True.")
        return self._create_user(telefono, password, **extra_fields)
