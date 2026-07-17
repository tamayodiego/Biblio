import pandas as pd
from constance import config
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Libro, Prestamo, Lector
from .serializers import LibroSerializer, PrestamoSerializer


class EsStaffOSoloLectura(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class LibroViewSet(viewsets.ModelViewSet):
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer

    permission_classes = [permissions.IsAuthenticated, EsStaffOSoloLectura]
    filter_backends = [filters.SearchFilter]
    search_fields = ['titulo', 'autor']

class PrestamoViewSet(viewsets.ModelViewSet):
    serializer_class = PrestamoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Prestamo.objects.all()
        return Prestamo.objects.filter(usuario=user)

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

    @action(detail=True, methods=['post'], url_path='pagar-multa')
    def pagar_multa(self, request, pk=None):
        prestamo = self.get_object()

        if prestamo.activo:
            return Response(
                {"error": "Solo se puede pagar la multa de un préstamo ya devuelto."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if prestamo.monto_multa <= 0:
            return Response(
                {"error": "Este préstamo no tiene multa pendiente de pago."},
                status=status.HTTP_400_BAD_REQUEST
            )

        prestamo.monto_multa = 0
        prestamo.save()

        serializer = self.get_serializer(prestamo)
        return Response({
            "mensaje": "Multa pagada correctamente.",
            "prestamo": serializer.data
        }, status=status.HTTP_200_OK)


class MiCuentaView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        lector, _ = Lector.objects.get_or_create(
            usuario=user,
            defaults={'numero_lector': f"LIB-{user.date_joined.year}-{user.id:04d}"}
        )

        prestamos_usuario = Prestamo.objects.filter(usuario=user)

        return Response({
            "id": user.id,
            "nombre_completo": user.get_full_name() or user.username,
            "email": user.email,
            "numero_lector": lector.numero_lector,
            "telefono": lector.telefono,
            "miembro_desde": user.date_joined,
            "activo": user.is_active,
            "libros_leidos": prestamos_usuario.filter(activo=False).count(),
            "prestamos_activos": prestamos_usuario.filter(activo=True).count(),
        })