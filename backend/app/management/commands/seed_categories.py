from django.core.management.base import BaseCommand
from app.models import Category

class Command(BaseCommand):
    help = 'Seed categories'
    
    def handle(self, *args, **options):
        categories = [
            {'name': 'Electronics', 'slug': 'electronics', 'icon': '📱'},
            {'name': 'Fashion', 'slug': 'fashion', 'icon': '👕'},
            {'name': 'Home Appliances', 'slug': 'home-appliances', 'icon': '🏠'},
            {'name': 'Books', 'slug': 'books', 'icon': '📔'},
        ]
        
        for cat in categories:
            Category.objects.get_or_create(**cat)
        
        self.stdout.write(self.style.SUCCESS('Categories seeded!'))