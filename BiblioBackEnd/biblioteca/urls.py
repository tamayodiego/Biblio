from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LibroViewSet, PrestamoViewSet

router = DefaultRouter()
router.register(r'libros', LibroViewSet)
router.register(r'prestamos', PrestamoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]