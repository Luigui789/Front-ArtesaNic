"""Permisos por rol y propietario, ejercitados con vistas de prueba a través de DRF completo
(autenticación Bearer real, permisos y respuestas)."""

from dataclasses import dataclass

from django.test import TestCase
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.test import APIRequestFactory
from rest_framework.views import APIView

from apps.accounts.api.permissions import EsArtesano, EsComprador, EsPropietario
from apps.accounts.api.tokens import emitir_tokens
from apps.accounts.models import Rol

from .base import crear_usuario


class VistaDeComprador(APIView):
    permission_classes = [EsComprador]

    def get(self, request):
        return Response({"ok": True})

    post = get


class VistaDeArtesano(APIView):
    permission_classes = [EsArtesano]

    def get(self, request):
        return Response({"ok": True})

    post = get


class VistaPorDefecto(APIView):
    def get(self, request):
        return Response({"ok": True})


@dataclass
class Recurso:
    propietario_id: int

    def pertenece_a(self, usuario):
        return usuario.pk == self.propietario_id


class VistaDeRecurso(APIView):
    permission_classes = [IsAuthenticated, EsPropietario]
    recursos: dict[int, Recurso] = {}

    def get(self, request, pk):
        self.check_object_permissions(request, self.recursos[pk])
        return Response({"id": pk})


class PermisosTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.comprador = crear_usuario("81111111", rol=Rol.COMPRADOR)
        self.artesano = crear_usuario("82222222", rol=Rol.ARTESANO)

    def pedir(self, vista, usuario=None, metodo="get", **kwargs):
        extra = {}
        if usuario is not None:
            extra["HTTP_AUTHORIZATION"] = f"Bearer {emitir_tokens(usuario)[0]}"
        peticion = getattr(self.factory, metodo)("/prueba/", format="json", **extra)
        return vista.as_view()(peticion, **kwargs)

    def test_rol_comprador(self):
        self.assertEqual(self.pedir(VistaDeComprador).status_code, 401)
        respuesta = self.pedir(VistaDeComprador, self.artesano)
        self.assertEqual(respuesta.status_code, 403)
        self.assertEqual(respuesta.data, {"detail": EsComprador.message})
        self.assertEqual(self.pedir(VistaDeComprador, self.comprador).status_code, 200)

    def test_rol_artesano(self):
        self.assertEqual(self.pedir(VistaDeArtesano).status_code, 401)
        self.assertEqual(self.pedir(VistaDeArtesano, self.comprador).status_code, 403)
        self.assertEqual(self.pedir(VistaDeArtesano, self.artesano).status_code, 200)

    def test_el_rol_lo_decide_el_servidor(self):
        """Lo que haría el selector del prototipo (rol en la petición) no concede nada."""
        peticion = self.factory.post(
            "/prueba/?rol=artesano",
            {"rol": "artesano"},
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {emitir_tokens(self.comprador)[0]}",
            HTTP_X_ROL="artesano",
        )
        self.assertEqual(VistaDeArtesano.as_view()(peticion).status_code, 403)

    def test_por_defecto_se_exige_autenticacion(self):
        self.assertEqual(self.pedir(VistaPorDefecto).status_code, 401)
        self.assertEqual(self.pedir(VistaPorDefecto, self.comprador).status_code, 200)

    def test_propietario(self):
        VistaDeRecurso.recursos = {
            1: Recurso(propietario_id=self.comprador.pk),
            2: Recurso(propietario_id=self.artesano.pk),
        }
        self.assertEqual(self.pedir(VistaDeRecurso, self.comprador, pk=1).status_code, 200)
        ajeno = self.pedir(VistaDeRecurso, self.comprador, pk=2)
        # Un recurso ajeno no revela su existencia (contrato, sección 1.9).
        self.assertEqual(ajeno.status_code, 404)
        self.assertEqual(ajeno.data, {"detail": "No encontrado."})
        self.assertEqual(self.pedir(VistaDeRecurso, pk=1).status_code, 401)

    def test_cuenta_de_administracion_sin_acceso_a_la_api(self):
        administrador = crear_usuario("88887777", rol=Rol.ADMINISTRADOR, is_staff=True)
        self.assertEqual(self.pedir(VistaPorDefecto, administrador).status_code, 401)
