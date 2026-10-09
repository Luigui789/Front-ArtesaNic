"""Gestión de cuentas en Django Admin (RF-013: activar y desactivar cuentas).

Un administrador de plataforma (rol administrador, ``is_staff``, sin superusuario)
solo cambia lo que sus permisos le conceden y nunca reasigna roles, otorga
privilegios internos ni cambia contraseñas ajenas: cualquiera de esas acciones le
permitiría actuar como otra persona y leer, por ejemplo, sus chats o comprobantes
(RF-013, RNF-004). Esas operaciones quedan reservadas a la cuenta técnica de superusuario.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import AdminUserCreationForm, UserChangeForm
from django.core.exceptions import PermissionDenied
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from .models import Usuario

# El admin de simplejwt muestra tokens de renovación completos, que sirven para
# suplantar a su titular. No se exponen en Django Admin.
admin.site.unregister(OutstandingToken)
admin.site.unregister(BlacklistedToken)

CAMPOS_RESERVADOS_AL_SUPERUSUARIO = (
    "telefono",
    "nombre",
    "rol",
    "is_staff",
    "is_superuser",
    "groups",
    "user_permissions",
)


class UsuarioCreationForm(AdminUserCreationForm):
    class Meta(AdminUserCreationForm.Meta):
        model = Usuario
        fields = ("telefono", "nombre", "rol")


class UsuarioChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = Usuario
        fields = "__all__"


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    form = UsuarioChangeForm
    add_form = UsuarioCreationForm
    list_display = ("telefono", "nombre", "rol", "is_active", "is_staff", "creado_en")
    list_filter = ("rol", "is_active", "is_staff", "is_superuser")
    search_fields = ("telefono", "nombre")
    ordering = ("-creado_en",)
    readonly_fields = ("creado_en", "last_login")
    fieldsets = (
        (None, {"fields": ("telefono", "password")}),
        ("Cuenta", {"fields": ("nombre", "rol", "is_active")}),
        (
            "Privilegios internos de Django",
            {"fields": ("is_staff", "is_superuser", "groups", "user_permissions")},
        ),
        ("Fechas", {"fields": ("creado_en", "last_login")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "telefono",
                    "nombre",
                    "rol",
                    "usable_password",
                    "password1",
                    "password2",
                ),
            },
        ),
    )

    def get_readonly_fields(self, request, obj=None):
        campos = super().get_readonly_fields(request, obj)
        if obj is not None and not request.user.is_superuser:
            campos = (*campos, *CAMPOS_RESERVADOS_AL_SUPERUSUARIO)
        return campos

    def user_change_password(self, request, id, form_url=""):
        if not request.user.is_superuser:
            raise PermissionDenied
        return super().user_change_password(request, id, form_url)
