"""Invariantes de la cuenta: creación por el manager y restricciones de PostgreSQL."""

from django.db import IntegrityError, transaction
from django.test import TestCase

from apps.accounts.models import Rol, Usuario

from .base import PASSWORD, crear_usuario


class CreacionDeCuentasTests(TestCase):
    def test_normaliza_el_telefono_y_guarda_la_contrasena_con_hash(self):
        usuario = crear_usuario("+505 8555-1234")
        self.assertEqual(usuario.telefono, "85551234")
        self.assertNotEqual(usuario.password, PASSWORD)
        self.assertNotIn(PASSWORD, usuario.password)
        self.assertTrue(usuario.check_password(PASSWORD))

    def test_valores_iniciales_sin_privilegios(self):
        usuario = crear_usuario()
        self.assertTrue(usuario.is_active)
        self.assertFalse(usuario.is_staff)
        self.assertFalse(usuario.is_superuser)

    def test_toda_cuenta_necesita_rol(self):
        with self.assertRaises(ValueError):
            Usuario.objects.create_user(telefono="85551234", password=PASSWORD, nombre="Sin rol")

    def test_rol_administrador_no_concede_privilegios_internos(self):
        administrador = crear_usuario(rol=Rol.ADMINISTRADOR)
        self.assertFalse(administrador.is_staff)
        self.assertFalse(administrador.is_superuser)
        self.assertFalse(administrador.puede_usar_api)

    def test_superusuario_es_cuenta_tecnica_con_rol_administrador(self):
        superusuario = Usuario.objects.create_superuser(
            telefono="88887777", password=PASSWORD, nombre="Mantenimiento"
        )
        self.assertEqual(superusuario.rol, Rol.ADMINISTRADOR)
        self.assertTrue(superusuario.is_staff)
        self.assertTrue(superusuario.is_superuser)

    def test_superusuario_no_admite_otro_rol(self):
        with self.assertRaises(ValueError):
            Usuario.objects.create_superuser(
                telefono="88887777", password=PASSWORD, nombre="X", rol=Rol.ARTESANO
            )

    def test_acceso_a_la_api(self):
        self.assertTrue(crear_usuario("81111111", rol=Rol.COMPRADOR).puede_usar_api)
        self.assertTrue(crear_usuario("82222222", rol=Rol.ARTESANO).puede_usar_api)
        self.assertFalse(crear_usuario("83333333", is_active=False).puede_usar_api)


class RestriccionesDeBaseDeDatosTests(TestCase):
    """Las restricciones se cumplen aunque se escriba saltando el manager y los formularios."""

    def setUp(self):
        self.usuario = crear_usuario()

    def assertViolaRestriccion(self, **cambios):
        with self.subTest(**cambios):
            with self.assertRaises(IntegrityError), transaction.atomic():
                Usuario.objects.filter(pk=self.usuario.pk).update(**cambios)

    def test_telefono_solo_en_forma_normalizada(self):
        for telefono in ["8555-123", "8555123", "+5058555", "abcdefgh"]:
            self.assertViolaRestriccion(telefono=telefono)

    def test_telefono_unico(self):
        with self.assertRaises(IntegrityError), transaction.atomic():
            Usuario.objects.create(telefono="85551234", nombre="Otra", rol=Rol.ARTESANO)

    def test_rol_valido(self):
        self.assertViolaRestriccion(rol="superadmin")

    def test_comprador_o_artesano_sin_privilegios_internos(self):
        for rol in (Rol.COMPRADOR, Rol.ARTESANO):
            self.assertViolaRestriccion(rol=rol, is_staff=True)
            self.assertViolaRestriccion(rol=rol, is_superuser=True)
