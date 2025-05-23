from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'orders', views.OrderViewSet, basename='order')

urlpatterns = [
    path('parts/', views.get_parts, name='get-parts'),
    path('parts/<str:part_id>/', views.get_part_by_id, name='get-part-by-id'),
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('create-checkout-session/', views.create_checkout_session, name='create-checkout-session'),
    path('session-status/', views.session_status, name='session-status'),
    path("cart/tdp/", views.get_cart_tdp, name="cart-tdp"),
    path('', include(router.urls)),
] 