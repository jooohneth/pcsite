import asyncio
import time
import jwt
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .models import PCPart, User
from .serializers import PCPartSerializer, UserSerializer
from django.views.decorators.csrf import csrf_exempt

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
                        {'price': {'$regex': search, '$options': 'i'}}
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

@csrf_exempt
@api_view(['POST'])
def register_view(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return Response({'error': 'All fields required'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects(username=username).first():
        return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
    user = User(username=username)
    user.set_password(password)
    user.save()
    serializer = UserSerializer(user)
    return Response({
        'message': 'User registered successfully',
        'user': serializer.data
    }, status=status.HTTP_201_CREATED)

@csrf_exempt
@api_view(['POST'])
def login_view(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return Response({'error': 'All fields required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
    
    if not user.check_password(password):
        return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
    
    payload = {
        'id': str(user.id),
        'exp': int(time.time()) + 60 * 60 * 24,
        'iat': int(time.time())
    }
    
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    serializer = UserSerializer(user)
    return Response({
        'token': token,
        'user': serializer.data
    })