"""Sonda de disponibilidad del proceso (RNF-006).

No consulta la base de datos ni expone datos internos.
"""

from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


class SaludView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    @extend_schema(
        tags=["Salud"],
        operation_id="consultar_salud",
        summary="Comprobar que el servicio responde",
        auth=[],
        responses={
            200: inline_serializer("Salud", fields={"estado": serializers.CharField()}),
        },
    )
    def get(self, request):
        return Response({"estado": "ok"})
