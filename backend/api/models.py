from mongoengine import Document, StringField, DecimalField, URLField, DictField
from werkzeug.security import generate_password_hash, check_password_hash

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
    type = StringField(max_length=50, required=True)  # CPU, GPU, etc.
    price = DecimalField(precision=2, required=True)
    url = URLField(max_length=500, required=True)
    specs = DictField(required=True)  # This will store nested specifications
    description = StringField(max_length=1000, required=False)

    meta = {
        'collection': 'products',  # Specify the exact collection name from MongoDB
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
