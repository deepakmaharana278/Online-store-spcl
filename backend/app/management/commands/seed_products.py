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
             'price': 999.99, 'image_url': 'https://picsum.photos/id/0/300/200',
             'rating': 4.8, 'category': electronics, 'stock': 50},
            {'name': 'Samsung Galaxy S24', 'description': 'Android flagship', 
             'price': 899.99, 'image_url': 'https://picsum.photos/id/1/300/200',
             'rating': 4.7, 'category': electronics, 'stock': 45},
            {'name': 'Sony Headphones', 'description': 'Noise cancelling', 
             'price': 349.99, 'image_url': 'https://picsum.photos/id/2/300/200',
             'rating': 4.9, 'category': electronics, 'stock': 30},
            {'name': 'Apple Watch Series 9', 'description': 'Fitness and health tracker', 
             'price': 399.99, 'image_url': 'https://picsum.photos/id/3/300/200',
             'rating': 4.8, 'category': electronics, 'stock': 60},
            {'name': 'iPad Air', 'description': 'Powerful tablet', 
             'price': 599.99, 'image_url': 'https://picsum.photos/id/10/300/200',
             'rating': 4.7, 'category': electronics, 'stock': 40},
            {'name': 'MacBook Air M3', 'description': 'Lightweight laptop', 
             'price': 1099.99, 'image_url': 'https://picsum.photos/id/11/300/200',
             'rating': 4.9, 'category': electronics, 'stock': 25},
            {'name': 'Google Pixel 8', 'description': 'Best camera phone', 
             'price': 699.99, 'image_url': 'https://picsum.photos/id/12/300/200',
             'rating': 4.6, 'category': electronics, 'stock': 35},
            {'name': 'Bose SoundLink Speaker', 'description': 'Portable Bluetooth speaker', 
             'price': 199.99, 'image_url': 'https://picsum.photos/id/13/300/200',
             'rating': 4.7, 'category': electronics, 'stock': 55},

            # Fashion
            {'name': 'Denim Jacket', 'description': 'Classic blue denim', 
             'price': 79.99, 'image_url': 'https://picsum.photos/id/4/300/200',
             'rating': 4.5, 'category': fashion, 'stock': 100},
            {'name': 'Summer Dress', 'description': 'Floral maxi dress', 
             'price': 49.99, 'image_url': 'https://picsum.photos/id/5/300/200',
             'rating': 4.3, 'category': fashion, 'stock': 75},
            {'name': 'Leather Wallet', 'description': 'Genuine leather bifold', 
             'price': 39.99, 'image_url': 'https://picsum.photos/id/14/300/200',
             'rating': 4.4, 'category': fashion, 'stock': 150},
            {'name': 'Running Shoes', 'description': 'Lightweight athletic shoes', 
             'price': 89.99, 'image_url': 'https://picsum.photos/id/15/300/200',
             'rating': 4.6, 'category': fashion, 'stock': 85},
            {'name': 'Cashmere Sweater', 'description': 'Soft and warm', 
             'price': 129.99, 'image_url': 'https://picsum.photos/id/16/300/200',
             'rating': 4.7, 'category': fashion, 'stock': 40},
            {'name': 'Sunglasses', 'description': 'Polarized UV protection', 
             'price': 149.99, 'image_url': 'https://picsum.photos/id/17/300/200',
             'rating': 4.5, 'category': fashion, 'stock': 90},
            {'name': 'Backpack', 'description': 'Waterproof laptop backpack', 
             'price': 59.99, 'image_url': 'https://picsum.photos/id/18/300/200',
             'rating': 4.6, 'category': fashion, 'stock': 110},

            # Home Appliances
            {'name': 'Instant Pot', 'description': 'Pressure cooker', 
             'price': 89.99, 'image_url': 'https://picsum.photos/id/7/300/200',
             'rating': 4.6, 'category': home, 'stock': 35},
            {'name': 'Coffee Maker', 'description': 'Programmable drip coffee maker', 
             'price': 79.99, 'image_url': 'https://picsum.photos/id/19/300/200',
             'rating': 4.5, 'category': home, 'stock': 45},
            {'name': 'Air Fryer', 'description': 'Healthy frying', 
             'price': 119.99, 'image_url': 'https://picsum.photos/id/20/300/200',
             'rating': 4.7, 'category': home, 'stock': 50},
            {'name': 'Bed Sheets Set', 'description': 'Egyptian cotton 400 thread count', 
             'price': 69.99, 'image_url': 'https://picsum.photos/id/21/300/200',
             'rating': 4.4, 'category': home, 'stock': 65},
            {'name': 'Robot Vacuum', 'description': 'Smart mapping technology', 
             'price': 299.99, 'image_url': 'https://picsum.photos/id/22/300/200',
             'rating': 4.8, 'category': home, 'stock': 20},
            {'name': 'Throw Pillows', 'description': 'Set of 2 decorative pillows', 
             'price': 34.99, 'image_url': 'https://picsum.photos/id/23/300/200',
             'rating': 4.3, 'category': home, 'stock': 120},
            {'name': 'Stand Mixer', 'description': 'Kitchen essential', 
             'price': 249.99, 'image_url': 'https://picsum.photos/id/24/300/200',
             'rating': 4.9, 'category': home, 'stock': 15},

            # Books
            {'name': 'Atomic Habits', 'description': 'Build good habits', 
             'price': 24.99, 'image_url': 'https://picsum.photos/id/9/300/200',
             'rating': 4.9, 'category': books, 'stock': 120},
            {'name': 'The Psychology of Money', 'description': 'Financial wisdom', 
             'price': 18.99, 'image_url': 'https://picsum.photos/id/25/300/200',
             'rating': 4.8, 'category': books, 'stock': 95},
            {'name': 'Project Hail Mary', 'description': 'Sci-fi adventure', 
             'price': 27.99, 'image_url': 'https://picsum.photos/id/26/300/200',
             'rating': 4.9, 'category': books, 'stock': 80},
            {'name': 'The Midnight Library', 'description': 'Life choices novel', 
             'price': 22.99, 'image_url': 'https://picsum.photos/id/27/300/200',
             'rating': 4.6, 'category': books, 'stock': 70},
            {'name': 'Educated', 'description': 'Memoir', 
             'price': 16.99, 'image_url': 'https://picsum.photos/id/28/300/200',
             'rating': 4.7, 'category': books, 'stock': 60},
            {'name': 'The Silent Patient', 'description': 'Psychological thriller', 
             'price': 19.99, 'image_url': 'https://picsum.photos/id/29/300/200',
             'rating': 4.7, 'category': books, 'stock': 85},

             # Sports & Outdoors
            {'name': 'Yoga Mat', 'description': 'Non-slip exercise mat', 
             'price': 29.99, 'image_url': 'https://picsum.photos/id/30/300/200',
             'rating': 4.5, 'category': sports, 'stock': 200},
            {'name': 'Dumbbell Set', 'description': 'Adjustable weights', 
             'price': 79.99, 'image_url': 'https://picsum.photos/id/31/300/200',
             'rating': 4.7, 'category': sports, 'stock': 45},
            {'name': 'Camping Tent', 'description': '4-person waterproof tent', 
             'price': 159.99, 'image_url': 'https://picsum.photos/id/32/300/200',
             'rating': 4.6, 'category': sports, 'stock': 25},
            {'name': 'Hiking Backpack', 'description': '40L with hydration reservoir', 
             'price': 89.99, 'image_url': 'https://picsum.photos/id/33/300/200',
             'rating': 4.7, 'category': sports, 'stock': 40},
            {'name': 'Basketball', 'description': 'Official size and weight', 
             'price': 34.99, 'image_url': 'https://picsum.photos/id/34/300/200',
             'rating': 4.5, 'category': sports, 'stock': 110},

            # Beauty & Personal Care
            {'name': 'Hair Dryer', 'description': 'Ionic professional dryer', 
             'price': 89.99, 'image_url': 'https://picsum.photos/id/35/300/200',
             'rating': 4.6, 'category': beauty, 'stock': 55},
            {'name': 'Skincare Set', 'description': 'Facial cleanser and moisturizer', 
             'price': 49.99, 'image_url': 'https://picsum.photos/id/36/300/200',
             'rating': 4.4, 'category': beauty, 'stock': 85},
            {'name': 'Electric Toothbrush', 'description': 'Rechargeable sonic', 
             'price': 59.99, 'image_url': 'https://picsum.photos/id/37/300/200',
             'rating': 4.7, 'category': beauty, 'stock': 70},
            {'name': 'Perfume', 'description': 'Eau de parfum', 
             'price': 79.99, 'image_url': 'https://picsum.photos/id/38/300/200',
             'rating': 4.8, 'category': beauty, 'stock': 40},

            # Toys & Games
            {'name': 'LEGO Set', 'description': '500-piece building kit', 
             'price': 49.99, 'image_url': 'https://picsum.photos/id/39/300/200',
             'rating': 4.8, 'category': toys, 'stock': 90},
            {'name': 'Board Game', 'description': 'Strategy game for families', 
             'price': 39.99, 'image_url': 'https://picsum.photos/id/40/300/200',
             'rating': 4.7, 'category': toys, 'stock': 65},
            {'name': 'Dollhouse', 'description': 'Wooden playset', 
             'price': 89.99, 'image_url': 'https://picsum.photos/id/41/300/200',
             'rating': 4.5, 'category': toys, 'stock': 30},
            {'name': 'Remote Control Car', 'description': 'Off-road RC vehicle', 
             'price': 59.99, 'image_url': 'https://picsum.photos/id/42/300/200',
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