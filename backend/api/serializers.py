from rest_framework import serializers
from rest_framework_mongoengine import serializers as mongo_serializers
from .models import PCPart

class PCPartSerializer(mongo_serializers.DocumentSerializer):
    class Meta:
        model = PCPart
        fields = ['id', 'name', 'manufacturer', 'type', 'price', 'url', 'specs'] 