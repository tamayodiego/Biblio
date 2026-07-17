from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from constance import config
import pandas as pd

class Libro(models.Model):
    titulo = models.CharField(max_length=200)
    autor = models.CharField(max_length=100)
    isbn = models.CharField(max_length=13, unique=True)
    fecha_publicacion = models.DateField()
    unidades = models.IntegerField(default=1)
    unidades_disponibles = models.IntegerField(default=1)
    en_multa = models.BooleanField(default=False)

    def __str__(self):
        return self.titulo


class Prestamo(models.Model):
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha_prestamo = models.DateTimeField(null=True, blank=True)    
    fecha_devolucion = models.DateTimeField(null=True, blank=True)
    fecha_devolucion_real = models.DateTimeField(null=True, blank=True)
    activo = models.BooleanField(default=True)
    renovacion_consumida = models
    monto_multa = models.DecimalField(max_digits=6, decimal_places=2, default=0.0)

    @property
    def calcular_multa_actual(self):
        from constance import config

        ahora = timezone.now() if self.activo else self.fecha_devolucion_real

        # Si no ha vencido la fecha límite, no hay multa
        if ahora <= self.fecha_devolucion:
            return 0.0

        # Calculamos días de atraso
        dias_atraso = (ahora - self.fecha_devolucion).days
        total = dias_atraso * config.MULTA_POR_DIA
        return min(total, config.TOPE_MAXIMO_MULTA)
    
    def save(self, *args, **kwargs):
        if not self.pk and self.activo:
            if self.libro.unidades_disponibles <= 0:
                raise ValueError("No hay unidades disponibles para este libro.")
            self.libro.unidades_disponibles -= 1
            self.libro.save()

        elif self.pk:
            prestamo_anterior = Prestamo.objects.get(pk=self.pk)
            if prestamo_anterior.activo and not self.activo:
                # El libro se está devolviendo
                self.libro.unidades_disponibles += 1
                self.libro.save()
                self.fecha_devolucion_real = timezone.now()  # Registramos cuándo se devolvió
                self.monto_multa = self.calcular_multa_actual  # Guardamos la multa final

        if not self.pk:  # Solo al crear
            from constance import config
            from datetime import timedelta
            
            # 1. Calculamos "ahora" UNA sola vez
            ahora = timezone.now()
            
            # 2. fecha_prestamo la calculamos nosotros (en lugar de auto_now_add)
            self.fecha_prestamo = ahora

            dias_permiso = config.PLAZO
            vencimiento = pd.to_datetime(ahora) + pd.tseries.offsets.BusinessDay(n=dias_permiso)
            
            # 3. fecha_devolucion se calcula a partir de esa misma variable
            self.fecha_devolucion = timezone.make_aware(vencimiento.to_pydatetime())
            
        super().save(*args, **kwargs)
    def __str__(self):
        return f"{self.usuario.username} tiene '{self.libro.titulo}'"