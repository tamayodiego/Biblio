from rest_framework import serializers
from .models import Libro, Prestamo

class LibroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Libro
        fields = '__all__'

class PrestamoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prestamo
        fields = '__all__'
        read_only_fields = ['fecha_prestamo', 'fecha_devolucion', 'fecha_devolucion_real','activo', 'renovacion_consumida', 'monto_multa']

    def validate(self, attrs):
        if self.instance is None:
            libro = attrs.get('libro')
            if libro is not None and libro.unidades_disponibles <= 0:
                raise serializers.ValidationError({"libro": "No hay unidades disponibles para este libro."})
        return attrs

    def to_representation(self, instance):
        # Recalculamos y guardamos la multa ANTES de devolver el dato
        multa_nueva = instance.calcular_multa_actual
        if instance.monto_multa != multa_nueva:
            instance.monto_multa = multa_nueva
            # Usamos update() para no disparar el save() completo
            Prestamo.objects.filter(pk=instance.pk).update(monto_multa=multa_nueva)

        return super().to_representation(instance)