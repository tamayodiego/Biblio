from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LibroViewSet, PrestamoViewSet, MiCuentaView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'libros', LibroViewSet)
router.register(r'prestamos', PrestamoViewSet, basename='prestamo')

urlpatterns = [
    path('mi-cuenta/', MiCuentaView.as_view()),
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]