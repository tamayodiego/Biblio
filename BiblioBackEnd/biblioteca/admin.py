from django.contrib import admin
from .models import Libro , Prestamo, Lector

admin.site.register(Libro)
admin.site.register(Prestamo)
admin.site.register(Lector)