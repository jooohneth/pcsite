from django.urls import path
from . import views

urlpatterns = [
    path('parts/', views.get_parts, name='get-parts'),
] 