from rest_framework import serializers
from rest_framework_mongoengine import serializers as mongo_serializers
from .models import PCPart, User, Order, OrderItem


class PCPartSerializer(mongo_serializers.DocumentSerializer):
    class Meta:
        model = PCPart
        fields = ['id', 'name', 'manufacturer', 'type', 'price', 'url', 'specs', 'description']

class UserSerializer(mongo_serializers.DocumentSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class OrderItemSerializer(mongo_serializers.EmbeddedDocumentSerializer):
    product_id = serializers.CharField(source='product.id', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['product_id', 'quantity'] 


class OrderSerializer(mongo_serializers.DocumentSerializer):
    user = UserSerializer(read_only=True) 
    items = OrderItemSerializer(many=True, read_only=True)
    order_items_input = serializers.ListField(
        child=serializers.DictField(), 
        write_only=True, 
        required=True,
        help_text="List of items, each with 'product_id' and 'quantity'. Ex: [{'product_id': '...', 'quantity': 1}]"
    )
    shipping_cost_input = serializers.FloatField(write_only=True, required=False)
    taxes_input = serializers.FloatField(write_only=True, required=False)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'items', 
            'subtotal', 'shipping_cost', 'taxes', 'total_amount', 
            'created_at', 'updated_at',
            'order_items_input', 'shipping_cost_input', 'taxes_input'
        ]
        read_only_fields = [
            'id', 'order_number', 'user', 'items', 
            'subtotal', 'shipping_cost', 'taxes', 'total_amount',
            'created_at', 'updated_at'
        ]

    def validate_order_items_input(self, items_input_data):
        if not items_input_data:
            raise serializers.ValidationError("Order items cannot be empty.")
        
        product_ids = []
        for item_data in items_input_data:
            if not isinstance(item_data, dict):
                 raise serializers.ValidationError("Each item must be a dictionary.")
            if 'product_id' not in item_data or 'quantity' not in item_data:
                raise serializers.ValidationError("Each item must contain 'product_id' and 'quantity'.")
            if not isinstance(item_data['quantity'], int) or item_data['quantity'] < 1:
                 raise serializers.ValidationError("Item quantity must be a positive integer.")
            product_ids.append(item_data['product_id'])
            
        try:
            found_products = PCPart.objects.filter(id__in=product_ids)
            found_ids = {str(p.id) for p in found_products}
            missing_ids = [pid for pid in product_ids if pid not in found_ids]
            if missing_ids:
                raise serializers.ValidationError(f"Products with IDs not found: {missing_ids}")
        except Exception as e:
            raise serializers.ValidationError(f"Error validating product IDs: {e}")
            
        return items_input_data

    def create(self, validated_data):
        items_input = validated_data.pop('order_items_input')
        shipping_cost_input = validated_data.pop('shipping_cost_input', 0.0) 
        taxes_input = validated_data.pop('taxes_input', None)
        user = validated_data.pop('user', None)
        if not user:
             raise serializers.ValidationError("User information is missing for order creation.")

        order_items = []
        subtotal = 0
        product_ids = [item['product_id'] for item in items_input]
        products = PCPart.objects.filter(id__in=product_ids)
        products_dict = {str(p.id): p for p in products}

        for item_data in items_input:
            product = products_dict.get(item_data['product_id'])
            if not product:
                raise serializers.ValidationError(f"Product {item_data['product_id']} inconsistency.") 

            quantity = item_data['quantity']
            current_price = product.price 
            order_items.append(OrderItem(
                product=product, 
                quantity=quantity
            ))
            subtotal += quantity * float(current_price) 

        shipping_cost = float(shipping_cost_input)
        taxes = float(taxes_input) if taxes_input is not None else (subtotal * 0.13)
        total_amount = subtotal + shipping_cost + taxes

        order = Order(
            user=user,
            items=order_items,
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            taxes=taxes,
            total_amount=total_amount,
            **{k: v for k, v in validated_data.items() if hasattr(Order, k)} 
        )
        
        order.save()
        return order