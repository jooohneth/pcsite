from django.urls import path
from .views import SearchPartsView
from .views import PartSpecsView

urlpatterns = [
    path('search_parts/', SearchPartsView.as_view(), name='search_parts'),
    path('part_specs/', PartSpecsView.as_view(), name='part_specs')
] 