from datetime import timedelta

from django.conf import settings
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from apps.accounts.api.authentication import MENSAJE_SESION_INVALIDA
from apps.accounts.api.csrf import MENSAJE_CSRF
from apps.accounts.api.views import MENSAJE_CREDENCIALES, MENSAJE_CUENTA_ADMINISTRACION
from apps.accounts.models import Rol, Usuario

from .base import (
    PASSWORD,
    URL_CSRF,
    URL_LOGIN,
    URL_LOGOUT,
    URL_PERFIL,
    URL_REFRESCAR,
    AuthAPITestCase,
    crear_usuario,
)


class CSRFTests(AuthAPITestCase):
    def test_entrega_token_y_cookie_sin_cache(self):
        respuesta = self.client.get(URL_CSRF)
        self.assertEqual(respuesta.status_code, 200)
        self.assertTrue(respuesta.json()["csrf_token"])
        self.assertIn(settings.CSRF_COOKIE_NAME, respuesta.cookies)
        self.assertIn("no-store", respuesta.headers["Cache-Control"])


class LoginTests(AuthAPITestCase):
    def setUp(self):
        super().setUp()
        self.usuario = crear_usuario("85551234", rol=Rol.ARTESANO)

    def login(self, telefono="85551234", password=PASSWORD, **extra):
        return self.post_con_csrf(URL_LOGIN, {"telefono": telefono, "password": password}, **extra)

    def assertCredencialesInvalidas(self, respuesta):
        self.assertEqual(respuesta.status_code, 401)
        self.assertEqual(respuesta.json(), {"detail": MENSAJE_CREDENCIALES})
        self.assertIn("WWW-Authenticate", respuesta.headers)
        self.assertNotIn("refresh", respuesta.cookies)

    def test_login_correcto(self):
        respuesta = self.login()
        self.assertEqual(respuesta.status_code, 200, respuesta.content)
        self.assertEqual(
            respuesta.json()["usuario"],
            {
                "id": self.usuario.pk,
                "nombre": "Ana Lucía Delgado",
                "telefono": "85551234",
                "rol": "artesano",
            },
        )
        self.assertEqual(set(respuesta.json()), {"access", "usuario"})
        cookie = respuesta.cookies["refresh"]
        self.assertTrue(cookie["httponly"])
        self.assertEqual(cookie["path"], "/api/v1/auth/")
        self.assertEqual(int(cookie["max-age"]), int(timedelta(days=7).total_seconds()))
        self.usuario.refresh_from_db()
        self.assertIsNotNone(self.usuario.last_login)

    def test_acepta_el_telefono_en_otros_formatos(self):
        for telefono in ["8555-1234", "+505 8555 1234"]:
            with self.subTest(telefono=telefono):
                self.assertEqual(self.login(telefono=telefono).status_code, 200)

    def test_contrasena_incorrecta(self):
        self.assertCredencialesInvalidas(self.login(password="otra-contrasena"))

    def test_telefono_no_registrado_responde_igual(self):
        self.assertCredencialesInvalidas(self.login(telefono="87654321"))

    def test_cuenta_inactiva_no_inicia_sesion(self):
        Usuario.objects.filter(pk=self.usuario.pk).update(is_active=False)
        self.assertCredencialesInvalidas(self.login())

    def test_cuenta_de_administracion_no_inicia_sesion_en_la_api(self):
        crear_usuario("88887777", rol=Rol.ADMINISTRADOR, is_staff=True)
        respuesta = self.login(telefono="88887777")
        self.assertEqual(respuesta.status_code, 403)
        self.assertEqual(respuesta.json(), {"detail": MENSAJE_CUENTA_ADMINISTRACION})
        self.assertNotIn("refresh", respuesta.cookies)

    def test_el_rol_no_se_elige_al_iniciar_sesion(self):
        respuesta = self.post_con_csrf(
            URL_LOGIN, {"telefono": "85551234", "password": PASSWORD, "rol": "comprador"}
        )
        self.assertEqual(respuesta.status_code, 400)
        self.assertEqual(respuesta.json(), {"rol": ["Campo no permitido."]})

    def test_telefono_con_formato_invalido(self):
        respuesta = self.login(telefono="123")
        self.assertEqual(respuesta.status_code, 400)
        self.assertIn("telefono", respuesta.json())

    def test_login_exige_csrf(self):
        respuesta = self.client.post(
            URL_LOGIN, {"telefono": "85551234", "password": PASSWORD}, format="json"
        )
        self.assertEqual(respuesta.status_code, 403)
        self.assertEqual(respuesta.json(), {"detail": MENSAJE_CSRF})
        self.assertNotIn("refresh", respuesta.cookies)

    def test_limite_de_intentos_por_ip(self):
        for _ in range(10):
            self.assertEqual(self.login(password="incorrecta").status_code, 401)
        # Bloqueado incluso con la contraseña correcta hasta que pase la ventana.
        respuesta = self.login()
        self.assertEqual(respuesta.status_code, 429)
        self.assertIn("Retry-After", respuesta.headers)

    def test_limite_de_intentos_por_cuenta_desde_varias_ip(self):
        for indice in range(20):
            respuesta = self.login(password="incorrecta", REMOTE_ADDR=f"10.0.0.{indice + 1}")
            self.assertEqual(respuesta.status_code, 401)
        self.assertEqual(self.login(REMOTE_ADDR="10.0.1.1").status_code, 429)
        # Otra cuenta desde una IP nueva no queda afectada.
        crear_usuario("81112222")
        self.assertEqual(self.login(telefono="81112222", REMOTE_ADDR="10.0.1.2").status_code, 200)

    def test_x_forwarded_for_no_elude_el_limite_por_ip(self):
        for indice in range(10):
            self.login(password="incorrecta", HTTP_X_FORWARDED_FOR=f"203.0.113.{indice}")
        respuesta = self.login(HTTP_X_FORWARDED_FOR="203.0.113.99")
        self.assertEqual(respuesta.status_code, 429)


class PerfilTests(AuthAPITestCase):
    def setUp(self):
        super().setUp()
        self.usuario = crear_usuario("85551234")

    def test_anonimo(self):
        respuesta = self.client.get(URL_PERFIL)
        self.assertEqual(respuesta.status_code, 401)
        self.assertEqual(respuesta.headers["WWW-Authenticate"], 'Bearer realm="api"')

    def test_devuelve_solo_la_identidad(self):
        self.con_token(self.iniciar_sesion())
        respuesta = self.client.get(URL_PERFIL)
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(
            respuesta.json(),
            {
                "id": self.usuario.pk,
                "nombre": "Ana Lucía Delgado",
                "telefono": "85551234",
                "rol": "comprador",
            },
        )
        contenido = respuesta.content.decode()
        self.assertNotIn(self.usuario.password, contenido)
        for campo in ("password", "is_staff", "is_superuser", "groups", "user_permissions"):
            self.assertNotIn(campo, respuesta.json())
        self.assertIn("no-store", respuesta.headers["Cache-Control"])

    def test_token_no_valido_sin_detalles_internos(self):
        for token in ["basura", str(RefreshToken.for_user(self.usuario))]:
            with self.subTest(token=token[:12]):
                self.con_token(token)
                respuesta = self.client.get(URL_PERFIL)
                self.assertEqual(respuesta.status_code, 401)
                self.assertEqual(respuesta.json(), {"detail": MENSAJE_SESION_INVALIDA})

    def test_token_caducado(self):
        token = AccessToken.for_user(self.usuario)
        token.set_exp(lifetime=-timedelta(seconds=1))
        self.con_token(str(token))
        self.assertEqual(self.client.get(URL_PERFIL).status_code, 401)

    def test_cuenta_desactivada_pierde_el_acceso_de_inmediato(self):
        self.con_token(self.iniciar_sesion())
        Usuario.objects.filter(pk=self.usuario.pk).update(is_active=False)
        self.assertEqual(self.client.get(URL_PERFIL).status_code, 401)
        self.client.credentials()
        self.assertEqual(self.post_con_csrf(URL_REFRESCAR).status_code, 401)


class RefrescarTests(AuthAPITestCase):
    def setUp(self):
        super().setUp()
        crear_usuario("85551234")
        self.iniciar_sesion()
        self.renovacion_inicial = self.client.cookies["refresh"].value

    def test_renueva_y_rota_la_cookie(self):
        respuesta = self.post_con_csrf(URL_REFRESCAR)
        self.assertEqual(respuesta.status_code, 200, respuesta.content)
        self.assertEqual(set(respuesta.json()), {"access"})
        nueva = respuesta.cookies["refresh"].value
        self.assertNotEqual(nueva, self.renovacion_inicial)
        self.assertTrue(respuesta.cookies["refresh"]["httponly"])

        self.con_token(respuesta.json()["access"])
        self.assertEqual(self.client.get(URL_PERFIL).status_code, 200)

        # La renovación anterior quedó revocada por la rotación.
        self.client.cookies["refresh"] = self.renovacion_inicial
        self.assertEqual(self.post_con_csrf(URL_REFRESCAR).status_code, 401)

    def test_sin_cookie(self):
        del self.client.cookies["refresh"]
        respuesta = self.post_con_csrf(URL_REFRESCAR)
        self.assertEqual(respuesta.status_code, 401)
        self.assertEqual(respuesta.json(), {"detail": MENSAJE_SESION_INVALIDA})

    def test_exige_csrf_y_no_rota_sin_el(self):
        respuesta = self.client.post(URL_REFRESCAR)
        self.assertEqual(respuesta.status_code, 403)
        self.assertNotIn("refresh", respuesta.cookies)
        self.assertEqual(self.post_con_csrf(URL_REFRESCAR).status_code, 200)

    def test_cookie_manipulada(self):
        self.client.cookies["refresh"] = self.renovacion_inicial[:-4] + "abcd"
        self.assertEqual(self.post_con_csrf(URL_REFRESCAR).status_code, 401)


class LogoutTests(AuthAPITestCase):
    def setUp(self):
        super().setUp()
        crear_usuario("85551234")
        self.access = self.iniciar_sesion()
        self.renovacion = self.client.cookies["refresh"].value

    def test_cierra_la_sesion_de_forma_efectiva(self):
        respuesta = self.post_con_csrf(URL_LOGOUT)
        self.assertEqual(respuesta.status_code, 204)
        cookie = respuesta.cookies["refresh"]
        self.assertEqual(cookie.value, "")
        self.assertEqual(int(cookie["max-age"]), 0)
        self.assertEqual(cookie["path"], "/api/v1/auth/")

        # La renovación queda revocada en el servidor, aunque alguien conservara la cookie.
        jti = RefreshToken(self.renovacion, verify=False)[api_settings.JTI_CLAIM]
        self.assertTrue(BlacklistedToken.objects.filter(token__jti=jti).exists())
        self.client.cookies["refresh"] = self.renovacion
        respuesta = self.post_con_csrf(URL_REFRESCAR)
        self.assertEqual(respuesta.status_code, 401)

    def test_el_acceso_ya_emitido_no_se_revoca_y_caduca_en_5_minutos(self):
        """Límite documentado del ADR-003/ADR-007: el frontend descarta el token al cerrar."""
        self.post_con_csrf(URL_LOGOUT)
        self.con_token(self.access)
        self.assertEqual(self.client.get(URL_PERFIL).status_code, 200)
        self.assertEqual(api_settings.ACCESS_TOKEN_LIFETIME, timedelta(minutes=5))

    def test_exige_csrf(self):
        respuesta = self.client.post(URL_LOGOUT)
        self.assertEqual(respuesta.status_code, 403)
        self.assertEqual(self.post_con_csrf(URL_REFRESCAR).status_code, 200)

    def test_idempotente_sin_cookie(self):
        del self.client.cookies["refresh"]
        self.assertEqual(self.post_con_csrf(URL_LOGOUT).status_code, 204)
        self.assertEqual(self.post_con_csrf(URL_LOGOUT).status_code, 204)
