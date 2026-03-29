from django.core.management.base import BaseCommand
from django.core.management import call_command

class Command(BaseCommand):
    help = 'Seed database with all data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting database seeding...'))
        
        # Run categories seed
        self.stdout.write('\n Seeding categories...')
        call_command('seed_categories')
        
        # Run products seed
        self.stdout.write('\n Seeding products...')
        call_command('seed_products')
        
        self.stdout.write(self.style.SUCCESS('\n Database seeding completed!'))