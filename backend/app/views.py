from rest_framework.decorators import api_view
from rest_framework.response import Response
from app.models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from django.db.models import Q



@api_view(['GET'])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def product_list(request):
    queryset = Product.objects.all()

    category = request.query_params.get('category')
    if category:
        queryset = queryset.filter(category__slug=category)

    min_price = request.query_params.get('min_price')
    max_price = request.query_params.get('max_price')
    if min_price:
        queryset = queryset.filter(price__gte=min_price)

    if max_price:
        queryset = queryset.filter(price__lte=max_price)

    min_rating = request.query_params.get('min_rating')
    if min_rating:
        queryset = queryset.filter(rating__gte=min_rating)

    search = request.query_params.get('search')
    if search:
        queryset = queryset.filter(
            Q(name__icontains=search) | Q(description__icontains=search)
        )

    ordering = request.query_params.get('ordering')
    if ordering:
        queryset = queryset.order_by(ordering)

    serializer = ProductSerializer(queryset,many=True)
    return Response(serializer.data)

    
@api_view(['GET'])
def featured_products(request):
    limit = request.query_params.get('limit', 8)
    try:
        limit = int(limit)
    except ValueError:
        limit = 8
    
    # Get top rated products
    products = Product.objects.all().order_by('-rating')[:limit]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)
