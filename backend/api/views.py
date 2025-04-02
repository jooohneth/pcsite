import asyncio
import time
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import PCPart
from .serializers import PCPartSerializer
from django.db.models import Q

@api_view(['GET'])
def get_parts(request):
    """
    Get PC parts from the database with optional filtering.
    Query parameters:
    - type: Filter by part type (CPU, GPU, etc.)
    - manufacturer: Filter by manufacturer
    - min_price: Filter by minimum price
    - max_price: Filter by maximum price
    """
    try:
        queryset = PCPart.objects

        # Apply filters based on query parameters
        part_type = request.query_params.get('type')
        if part_type:
            queryset = queryset.filter(type__iexact=part_type)

        manufacturer = request.query_params.get('manufacturer')
        if manufacturer:
            queryset = queryset.filter(manufacturer__iexact=manufacturer)

        min_price = request.query_params.get('min_price')
        if min_price and min_price.isdigit():
            queryset = queryset.filter(price__gte=float(min_price))

        max_price = request.query_params.get('max_price')
        if max_price and max_price.isdigit():
            queryset = queryset.filter(price__lte=float(max_price))

        # Get the filtered results
        parts = queryset.all()
        serializer = PCPartSerializer(parts, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


