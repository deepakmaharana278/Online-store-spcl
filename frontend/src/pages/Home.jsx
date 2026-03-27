import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ProductCard from "./ProductCard";
import { fetchProducts } from "../services/api";
import FilterSidebar from "./FilterSidebar";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    search: "",
    ordering: ""
  });

  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    setFilters(prev => ({ 
      ...prev, 
      category: category || "",
      search: search || ""
    }));
  }, [searchParams]);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchProducts(filters);
    setProducts(data);
    setLoading(false);
  };


  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleSortChange = (ordering) => {
    setFilters({ ...filters, ordering });
  };

  const handleAddToCart = (product) => {
    toast.success(`${product.name} added to cart!`);
  };

  return (
   <Layout>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        </div>
      
        <div className="lg:w-3/4">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
            <p className="text-gray-600">{products.length} products found</p>
            <select
              value={filters.ordering}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="">Sort by: Featured</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-rating">Rating: High to Low</option>
            </select>
          </div>
          
          {loading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
