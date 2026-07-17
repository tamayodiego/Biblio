import pandas as pd
from constance import config
from rest_framework import viewsets, permissions, status
from rest_framework.permissions import DjangoModelPermissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Libro, Prestamo
from .serializers import LibroSerializer, PrestamoSerializer

class LibroViewSet(viewsets.ModelViewSet):
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer

    permission_classes = [DjangoModelPermissions]

class PrestamoViewSet(viewsets.ModelViewSet):
    queryset = Prestamo.objects.all()
    serializer_class = PrestamoSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'], url_path='renovar')
    def renovar(self, request, pk=None):
        
        # 1. Obtenemos el préstamo por su PK
        prestamo = self.get_object()
        
        # 2. Validaciones
        if not prestamo.activo:
            return Response(
                {"error": "No se puede renovar un préstamo ya devuelto."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if prestamo.calcular_multa_actual > 0:
            return Response(
                {"error": "No se puede renovar un préstamo que está en multa."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if prestamo.renovacion_consumida:
            return Response(
                {"error": "Este préstamo ya usó su única renovación disponible."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. Calculamos la nueva fecha con pandas usando la constante
        dias = config.DIAS_PRESTAMO_ESTANDAR
        nueva_fecha = (
            pd.to_datetime(prestamo.fecha_devolucion) +
            pd.tseries.offsets.BusinessDay(n=dias)
        )
        prestamo.fecha_devolucion = nueva_fecha.to_pydatetime().replace(
            hour=23, minute=59, second=59, microsecond=0
        )
        prestamo.renovacion_consumida = True
        prestamo.save()

        # 4. Devolvemos el préstamo actualizado
        serializer = self.get_serializer(prestamo)
        return Response({
            "mensaje": f"Préstamo renovado por {dias} días hábiles.",
            "prestamo": serializer.data
        }, status=status.HTTP_200_OK)