from django.core.exceptions import ValidationError
from django.test import SimpleTestCase

from apps.accounts.phone import MENSAJE_FORMATO, MENSAJE_OTRO_PAIS, normalizar_telefono


class NormalizarTelefonoTests(SimpleTestCase):
    def assertInvalido(self, valor, mensaje):
        with self.subTest(valor=valor):
            with self.assertRaises(ValidationError) as contexto:
                normalizar_telefono(valor)
            self.assertEqual(contexto.exception.messages, [mensaje])

    def test_formatos_nacionales_equivalentes(self):
        for valor in [
            "85551234",
            "8555 1234",
            "8555-1234",
            "8555.1234",
            "  8555 1234  ",
            "(8555) 1234",
            "8555 1234",  # espacio no separable
            "８５５５１２３４",  # dígitos de ancho completo (teclados móviles)
        ]:
            with self.subTest(valor=valor):
                self.assertEqual(normalizar_telefono(valor), "85551234")

    def test_prefijo_de_nicaragua(self):
        for valor in [
            "+505 8555 1234",
            "+50585551234",
            "+505-8555-1234",
            "+(505) 8555-1234",
            "505 8555 1234",
            "50585551234",
            "(505) 8555-1234",
        ]:
            with self.subTest(valor=valor):
                self.assertEqual(normalizar_telefono(valor), "85551234")

    def test_numero_nacional_que_empieza_por_505_se_conserva(self):
        self.assertEqual(normalizar_telefono("5051 2345"), "50512345")

    def test_telefonos_de_otros_paises(self):
        for valor in ["+506 8555 1234", "+1 305 555 1234", "+52 55 1234 5678"]:
            self.assertInvalido(valor, MENSAJE_OTRO_PAIS)

    def test_formatos_invalidos(self):
        for valor in [
            "",
            "   ",
            "8555123",  # 7 dígitos
            "855512345",  # 9 dígitos
            "5058555123",  # 10 dígitos: ni nacional ni con prefijo
            "+505 8555 123",
            "+505",
            "+",
            "++505 8555 1234",
            "abcd1234",
            "8555_1234",
            "٨٥٥٥١٢٣٤",  # dígitos arábigo-índicos: no son ASCII tras normalizar
            None,
            85551234,
        ]:
            self.assertInvalido(valor, MENSAJE_FORMATO)
