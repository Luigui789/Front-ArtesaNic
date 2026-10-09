"""Django Admin: la administración de plataforma no obtiene un acceso general (RF-013)."""

from django.contrib.auth.models import Permission
from django.test import TestCase

from apps.accounts.admin import CAMPOS_RESERVADOS_AL_SUPERUSUARIO
from apps.accounts.models import Rol, Usuario

from .base import PASSWORD, crear_usuario


class AdminDeCuentasTests(TestCase):
    def setUp(self):
        self.cuenta = crear_usuario("85551234", rol=Rol.ARTESANO)
        self.administrador = crear_usuario("88887777", rol=Rol.ADMINISTRADOR, is_staff=True)
        self.administrador.user_permissions.add(
            *Permission.objects.filter(codename__in=["view_usuario", "change_usuario"])
        )
        self.superusuario = Usuario.objects.create_superuser(
            telefono="89990000", password=PASSWORD, nombre="Mantenimiento"
        )
        self.url_cambio = f"/admin/accounts/usuario/{self.cuenta.pk}/change/"
        self.url_contrasena = f"/admin/accounts/usuario/{self.cuenta.pk}/password/"

    def test_administrador_de_plataforma_activa_y_desactiva_cuentas(self):
        self.client.force_login(self.administrador)
        respuesta = self.client.get(self.url_cambio)
        self.assertEqual(respuesta.status_code, 200)
        solo_lectura = respuesta.context["adminform"].readonly_fields
        for campo in CAMPOS_RESERVADOS_AL_SUPERUSUARIO:
            self.assertIn(campo, solo_lectura)

        # Intenta además escalar privilegios: los campos de solo lectura se ignoran.
        respuesta = self.client.post(
            self.url_cambio,
            {"is_active": "", "rol": Rol.ADMINISTRADOR, "is_staff": "on", "is_superuser": "on"},
        )
        self.assertEqual(respuesta.status_code, 302, getattr(respuesta, "context", None))
        self.cuenta.refresh_from_db()
        self.assertFalse(self.cuenta.is_active)
        self.assertEqual(self.cuenta.rol, Rol.ARTESANO)
        self.assertFalse(self.cuenta.is_staff)
        self.assertFalse(self.cuenta.is_superuser)

    def test_administrador_de_plataforma_no_cambia_contrasenas_ajenas(self):
        self.client.force_login(self.administrador)
        self.assertEqual(self.client.get(self.url_contrasena).status_code, 403)

    def test_superusuario_conserva_la_gestion_completa(self):
        self.client.force_login(self.superusuario)
        respuesta = self.client.get(self.url_cambio)
        self.assertEqual(respuesta.status_code, 200)
        self.assertNotIn("is_superuser", respuesta.context["adminform"].readonly_fields)
        self.assertEqual(self.client.get(self.url_contrasena).status_code, 200)

    def test_tokens_de_renovacion_no_se_exponen(self):
        self.client.force_login(self.superusuario)
        for url in [
            "/admin/token_blacklist/outstandingtoken/",
            "/admin/token_blacklist/blacklistedtoken/",
        ]:
            with self.subTest(url=url):
                self.assertEqual(self.client.get(url).status_code, 404)

    def test_comprador_o_artesano_no_entran_al_admin(self):
        self.client.force_login(self.cuenta)
        respuesta = self.client.get("/admin/")
        self.assertEqual(respuesta.status_code, 302)
        self.assertIn("/admin/login/", respuesta["Location"])
