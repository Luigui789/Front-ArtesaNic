"""Normalización del teléfono de acceso (RF-004).

El teléfono identifica la cuenta. Se guarda en su forma canónica: los 8 dígitos
del número nacional de Nicaragua, sin prefijo de país ni separadores, que es la
representación del contrato de API ("85551234"). Así, "8555-1234",
"+505 8555 1234" y "85551234" son la misma cuenta y no pueden duplicarse.

Alcance vigente: solo números de Nicaragua. No se valida el plan de numeración
(prefijos de operador o de telefonía fija): cualquier secuencia de 8 dígitos es
válida, como en el formulario del prototipo.
"""

import re
import unicodedata

from django.core.exceptions import ValidationError

CODIGO_PAIS = "505"
DIGITOS_NACIONALES = 8

# Forma canónica. \A y \Z significan lo mismo en Python y en PostgreSQL, a
# diferencia de ^ y $ (en Python, $ también acepta un salto de línea final).
PATRON_TELEFONO_NORMALIZADO = r"\A[0-9]{8}\Z"

MENSAJE_FORMATO = "Ingresa un teléfono de Nicaragua de 8 dígitos."
MENSAJE_OTRO_PAIS = "Solo se admiten teléfonos de Nicaragua (+505)."

_SEPARADORES = re.compile(r"[\s().-]")
_DIGITOS = re.compile(r"[0-9]+")


def normalizar_telefono(valor: object) -> str:
    """Devuelve los 8 dígitos del número nacional o lanza ``ValidationError``.

    Admite espacios, guiones, puntos y paréntesis, y el prefijo de país escrito
    como "+505" o como "505" (este último solo si le siguen exactamente 8 dígitos;
    un número de 8 dígitos que empieza por 505 se conserva tal cual).
    """
    if not isinstance(valor, str):
        raise ValidationError(MENSAJE_FORMATO, code="telefono_invalido")

    compacto = _SEPARADORES.sub("", unicodedata.normalize("NFKC", valor))

    if compacto.startswith("+"):
        internacional = compacto[1:]
        if not _DIGITOS.fullmatch(internacional):
            raise ValidationError(MENSAJE_FORMATO, code="telefono_invalido")
        if not internacional.startswith(CODIGO_PAIS):
            raise ValidationError(MENSAJE_OTRO_PAIS, code="telefono_otro_pais")
        compacto = internacional[len(CODIGO_PAIS) :]
    elif len(compacto) == len(CODIGO_PAIS) + DIGITOS_NACIONALES and compacto.startswith(
        CODIGO_PAIS
    ):
        compacto = compacto[len(CODIGO_PAIS) :]

    if not re.match(PATRON_TELEFONO_NORMALIZADO, compacto):
        raise ValidationError(MENSAJE_FORMATO, code="telefono_invalido")
    return compacto
