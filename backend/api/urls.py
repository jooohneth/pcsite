from django.urls import path
from . import views

urlpatterns = [
    path('parts/', views.get_parts, name='get-parts'),
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path("cart/tdp/", views.get_cart_tdp, name="cart-tdp")
] 