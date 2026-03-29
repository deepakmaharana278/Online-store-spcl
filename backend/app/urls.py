from django.urls import path
from .views import *


urlpatterns = [
    path('categories/', category_list),
    path('products/', product_list),
    path('products/featured/',featured_products),
]
