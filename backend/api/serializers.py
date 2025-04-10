from rest_framework import serializers
from rest_framework_mongoengine import serializers as mongo_serializers
from .models import PCPart, User


class PCPartSerializer(mongo_serializers.DocumentSerializer):
    class Meta:
        model = PCPart
        fields = ['id', 'name', 'manufacturer', 'type', 'price', 'url', 'specs', 'description']

class UserSerializer(mongo_serializers.DocumentSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']