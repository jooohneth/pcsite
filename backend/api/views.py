import asyncio
import time
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import PCPart
from .serializers import PCPartSerializer
import logging

logger = logging.getLogger(__name__)

@api_view(['GET'])
def get_parts(request):
    try:
        queryset = PCPart.objects

        part_type = request.query_params.get('type')
        if part_type and part_type.lower() != 'all':
            queryset = queryset.filter(type__iexact=part_type)

        manufacturer = request.query_params.get('manufacturer')
        if manufacturer and manufacturer.lower() != 'all':
            queryset = queryset.filter(manufacturer__iexact=manufacturer)

        min_price = request.query_params.get('min_price')
        if min_price:
            try:
                min_price_float = float(min_price)
                queryset = queryset.filter(price__gte=min_price_float)
            except ValueError:
                logger.warning(f"Invalid min_price value: {min_price}")

        max_price = request.query_params.get('max_price')
        if max_price:
            try:
                max_price_float = float(max_price)
                queryset = queryset.filter(price__lte=max_price_float)
            except ValueError:
                logger.warning(f"Invalid max_price value: {max_price}")

        search = request.query_params.get('search')
        if search:
            search = search.strip()
            try:
                queryset = queryset.filter(__raw__={
                    '$or': [
                        {'name': {'$regex': search, '$options': 'i'}},
                        {'manufacturer': {'$regex': search, '$options': 'i'}},
                        {'type': {'$regex': search, '$options': 'i'}},
                    ]
                })
                print(f"Search results count: {queryset.count()}")
            except Exception as e:
                logger.error(f"Search error: {str(e)}")
                raise

        parts = queryset.all()
        serializer = PCPartSerializer(parts, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error in get_parts: {str(e)}", exc_info=True)
        return Response({
            "error": "An error occurred while fetching parts. Please try again."
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


