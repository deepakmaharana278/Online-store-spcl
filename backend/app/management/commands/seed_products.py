from django.core.management.base import BaseCommand
from app.models import Category, Product

class Command(BaseCommand):
    help = 'Seed products'
    
    def handle(self, *args, **kwargs):
        try:
            electronics = Category.objects.get(slug='electronics')
            fashion = Category.objects.get(slug='fashion')
            home = Category.objects.get(slug='home-appliances')
            books = Category.objects.get(slug='books')
            sports = Category.objects.get(slug='sports')
            beauty = Category.objects.get(slug='beauty')
            toys = Category.objects.get(slug='toys')
        except Category.DoesNotExist as e:
            self.stdout.write(self.style.ERROR(f'Category not found: {e}'))
            self.stdout.write(self.style.WARNING('Please create categories first using: python manage.py seed_categories'))
            return
        
        products = [
            # Electronics
            {'name': 'iPhone 15 Pro', 'description': 'Latest Apple smartphone', 
            'price': 134900, 'image_url': 'https://images.unsplash.com/photo-1696446701796-da61339f5f0e?w=300&h=200&fit=crop',
            'rating': 4.8, 'category': electronics, 'stock': 50},
            {'name': 'Samsung Galaxy S24', 'description': 'Android flagship', 
            'price': 79999, 'image_url': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=200&fit=crop',
            'rating': 4.7, 'category': electronics, 'stock': 45},
            {'name': 'Sony Headphones', 'description': 'Noise cancelling', 
            'price': 29990, 'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop',
            'rating': 4.9, 'category': electronics, 'stock': 30},
            {'name': 'Apple Watch Series 9', 'description': 'Fitness and health tracker', 
            'price': 45900, 'image_url': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&h=200&fit=crop',
            'rating': 4.8, 'category': electronics, 'stock': 60},
            {'name': 'iPad Air', 'description': 'Powerful tablet', 
            'price': 59900, 'image_url': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop',
            'rating': 4.7, 'category': electronics, 'stock': 40},
            {'name': 'MacBook Air M3', 'description': 'Lightweight laptop', 
            'price': 114900, 'image_url': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop',
            'rating': 4.9, 'category': electronics, 'stock': 25},
            {'name': 'Google Pixel 8', 'description': 'Best camera phone', 
            'price': 75999, 'image_url': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=200&fit=crop',
            'rating': 4.6, 'category': electronics, 'stock': 35},
            {'name': 'Bose SoundLink Speaker', 'description': 'Portable Bluetooth speaker', 
            'price': 19999, 'image_url': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=200&fit=crop',
            'rating': 4.7, 'category': electronics, 'stock': 55},

            # Fashion
            {'name': 'Denim Jacket', 'description': 'Classic blue denim', 
            'price': 3999, 'image_url': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&h=200&fit=crop',
            'rating': 4.5, 'category': fashion, 'stock': 100},
            {'name': 'Summer Dress', 'description': 'Floral maxi dress', 
            'price': 2499, 'image_url': 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&h=200&fit=crop',
            'rating': 4.3, 'category': fashion, 'stock': 75},
            {'name': 'Leather Wallet', 'description': 'Genuine leather bifold', 
            'price': 1499, 'image_url': 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=200&fit=crop',
            'rating': 4.4, 'category': fashion, 'stock': 150},
            {'name': 'Running Shoes', 'description': 'Lightweight athletic shoes', 
            'price': 4999, 'image_url': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop',
            'rating': 4.6, 'category': fashion, 'stock': 85},
            {'name': 'Cashmere Sweater', 'description': 'Soft and warm', 
            'price': 7999, 'image_url': 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=200&fit=crop',
            'rating': 4.7, 'category': fashion, 'stock': 40},
            {'name': 'Sunglasses', 'description': 'Polarized UV protection', 
            'price': 2999, 'image_url': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&h=200&fit=crop',
            'rating': 4.5, 'category': fashion, 'stock': 90},
            {'name': 'Backpack', 'description': 'Waterproof laptop backpack', 
            'price': 3499, 'image_url': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop',
            'rating': 4.6, 'category': fashion, 'stock': 110},

            # Home Appliances
            {'name': 'Instant Pot', 'description': 'Pressure cooker', 
            'price': 8999, 'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
            'rating': 4.6, 'category': home, 'stock': 35},
            {'name': 'Coffee Maker', 'description': 'Programmable drip coffee maker', 
            'price': 5999, 'image_url': 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=300&h=200&fit=crop',
            'rating': 4.5, 'category': home, 'stock': 45},
            {'name': 'Air Fryer', 'description': 'Healthy frying', 
            'price': 8999, 'image_url': 'https://images.unsplash.com/photo-1648017777497-f48a7b1c7c5d?w=300&h=200&fit=crop',
            'rating': 4.7, 'category': home, 'stock': 50},
            {'name': 'Bed Sheets Set', 'description': 'Egyptian cotton 400 thread count', 
            'price': 3999, 'image_url': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&h=200&fit=crop',
            'rating': 4.4, 'category': home, 'stock': 65},
            {'name': 'Robot Vacuum', 'description': 'Smart mapping technology', 
            'price': 34999, 'image_url': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300&h=200&fit=crop',
            'rating': 4.8, 'category': home, 'stock': 20},
            {'name': 'Throw Pillows', 'description': 'Set of 2 decorative pillows', 
            'price': 1999, 'image_url': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&h=200&fit=crop',
            'rating': 4.3, 'category': home, 'stock': 120},
            {'name': 'Stand Mixer', 'description': 'Kitchen essential', 
            'price': 24999, 'image_url': 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=300&h=200&fit=crop',
            'rating': 4.9, 'category': home, 'stock': 15},

            # Books
            {'name': 'Atomic Habits', 'description': 'Build good habits', 
            'price': 499, 'image_url': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=200&fit=crop',
            'rating': 4.9, 'category': books, 'stock': 120},
            {'name': 'The Psychology of Money', 'description': 'Financial wisdom', 
            'price': 399, 'image_url': 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=300&h=200&fit=crop',
            'rating': 4.8, 'category': books, 'stock': 95},
            {'name': 'Project Hail Mary', 'description': 'Sci-fi adventure', 
            'price': 599, 'image_url': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=200&fit=crop',
            'rating': 4.9, 'category': books, 'stock': 80},
            {'name': 'The Midnight Library', 'description': 'Life choices novel', 
            'price': 499, 'image_url': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=200&fit=crop',
            'rating': 4.6, 'category': books, 'stock': 70},
            {'name': 'Educated', 'description': 'Memoir', 
            'price': 399, 'image_url': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop',
            'rating': 4.7, 'category': books, 'stock': 60},
            {'name': 'The Silent Patient', 'description': 'Psychological thriller', 
            'price': 449, 'image_url': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=200&fit=crop',
            'rating': 4.7, 'category': books, 'stock': 85},

            # Sports & Outdoors
            {'name': 'Yoga Mat', 'description': 'Non-slip exercise mat', 
            'price': 1499, 'image_url': 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=300&h=200&fit=crop',
            'rating': 4.5, 'category': sports, 'stock': 200},
            {'name': 'Dumbbell Set', 'description': 'Adjustable weights', 
            'price': 4999, 'image_url': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=200&fit=crop',
            'rating': 4.7, 'category': sports, 'stock': 45},
            {'name': 'Camping Tent', 'description': '4-person waterproof tent', 
            'price': 7999, 'image_url': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&h=200&fit=crop',
            'rating': 4.6, 'category': sports, 'stock': 25},
            {'name': 'Hiking Backpack', 'description': '40L with hydration reservoir', 
            'price': 5999, 'image_url': 'https://images.unsplash.com/photo-1622260614927-5c1c5d74aa64?w=300&h=200&fit=crop',
            'rating': 4.7, 'category': sports, 'stock': 40},
            {'name': 'Basketball', 'description': 'Official size and weight', 
            'price': 1999, 'image_url': 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=300&h=200&fit=crop',
            'rating': 4.5, 'category': sports, 'stock': 110},

            # Beauty & Personal Care
            {'name': 'Hair Dryer', 'description': 'Ionic professional dryer', 
            'price': 3999, 'image_url': 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=300&h=200&fit=crop',
            'rating': 4.6, 'category': beauty, 'stock': 55},
            {'name': 'Skincare Set', 'description': 'Facial cleanser and moisturizer', 
            'price': 2499, 'image_url': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=200&fit=crop',
            'rating': 4.4, 'category': beauty, 'stock': 85},
            {'name': 'Electric Toothbrush', 'description': 'Rechargeable sonic', 
            'price': 3999, 'image_url': 'https://images.unsplash.com/photo-1559589689-577aabd1db4f?w=300&h=200&fit=crop',
            'rating': 4.7, 'category': beauty, 'stock': 70},
            {'name': 'Perfume', 'description': 'Eau de parfum', 
            'price': 5999, 'image_url': 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=300&h=200&fit=crop',
            'rating': 4.8, 'category': beauty, 'stock': 40},

            # Toys & Games
            {'name': 'LEGO Set', 'description': '500-piece building kit', 
            'price': 3999, 'image_url': 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300&h=200&fit=crop',
            'rating': 4.8, 'category': toys, 'stock': 90},
            {'name': 'Board Game', 'description': 'Strategy game for families', 
            'price': 2999, 'image_url': 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=300&h=200&fit=crop',
            'rating': 4.7, 'category': toys, 'stock': 65},
            {'name': 'Dollhouse', 'description': 'Wooden playset', 
            'price': 5999, 'image_url': 'https://images.unsplash.com/photo-1561807049-96def28e5e8f?w=300&h=200&fit=crop',
            'rating': 4.5, 'category': toys, 'stock': 30},
            {'name': 'Remote Control Car', 'description': 'Off-road RC vehicle', 
            'price': 3999, 'image_url': 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=300&h=200&fit=crop',
            'rating': 4.6, 'category': toys, 'stock': 45},
        ]
        created_count = 0
        skipped_count = 0
        
        for product_data in products:
            obj, created = Product.objects.get_or_create(
                name=product_data['name'],
                defaults=product_data
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Created: {obj.name}'))
            else:
                skipped_count += 1
                self.stdout.write(self.style.WARNING(f'Already exists: {obj.name}'))
        
        self.stdout.write(self.style.SUCCESS(f'\nSeeding complete! Created: {created_count}, Already existed: {skipped_count}'))