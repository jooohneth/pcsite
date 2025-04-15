from mongoengine import Document, StringField, DecimalField, URLField, DictField, EmbeddedDocument, ListField, ReferenceField, DateTimeField, FloatField, IntField, EmbeddedDocumentField
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

# Create your models here.

class User(Document):
    username = StringField(required=True, unique=True)
    password_hash = StringField(required=True)
    meta = {'collection': 'users'}
    
    def set_password(self,password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self,password):
        return check_password_hash(self.password_hash, password)
        
    

class PCPart(Document):
    name = StringField(max_length=200, required=True)
    manufacturer = StringField(max_length=100, required=True)
    type = StringField(max_length=50, required=True)
    price = DecimalField(precision=2, required=True)
    url = URLField(max_length=500, required=True)
    specs = DictField(required=True)    
    description = StringField(max_length=1000, required=False)

    meta = {
        'collection': 'products', 
        'indexes': [
            'type',
            'manufacturer',
            'name'
        ]
    }

    def __str__(self):
        return f"{self.manufacturer} {self.name} ({self.type})"

    @property
    def cores(self):
        return self.specs.get('Cores')
    
    @property
    def threads(self):
        return self.specs.get('Threads')
    
    @property
    def base_clock(self):
        return self.specs.get('Base Clock')
    
    @property
    def boost_clock(self):
        return self.specs.get('Boost Clock')
    
    @property
    def tdp(self):
        return self.specs.get('TDP')
    
    @property
    def socket(self):
        return self.specs.get('Socket')


class OrderItem(EmbeddedDocument):
    product = ReferenceField('PCPart', required=True) 
    quantity = IntField(required=True, min_value=1)

class Order(Document):
    order_number = StringField(unique=True)
    user = ReferenceField(User, required=True)
    items = ListField(EmbeddedDocumentField(OrderItem), required=True)
    subtotal = FloatField(required=True)
    shipping_cost = FloatField(default=0.0)
    taxes = FloatField(default=0.0)
    total_amount = FloatField(required=True)
    created_at = DateTimeField(default=datetime.datetime.utcnow)
    updated_at = DateTimeField(default=datetime.datetime.utcnow)

    meta = {
        'collection': 'orders',
        'indexes': [
            'user',
            'order_number',
            'created_at'
        ]
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.datetime.utcnow()
  
        if not self.order_number:
             timestamp = self.created_at.strftime('%Y%m%d%H%M%S')
             user_id_part = str(self.user.id)[-4:] 
             self.order_number = f"ORD-{timestamp}-{user_id_part}"
        super(Order, self).save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.order_number} by {self.user.username}"
