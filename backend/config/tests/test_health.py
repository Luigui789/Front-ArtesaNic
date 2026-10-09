from django.test import SimpleTestCase


class SaludTests(SimpleTestCase):
    def test_responde_sin_autenticacion_ni_datos_internos(self):
        respuesta = self.client.get("/api/v1/salud/")
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.json(), {"estado": "ok"})

    def test_un_token_invalido_no_afecta_la_sonda(self):
        respuesta = self.client.get("/api/v1/salud/", HTTP_AUTHORIZATION="Bearer basura")
        self.assertEqual(respuesta.status_code, 200)
