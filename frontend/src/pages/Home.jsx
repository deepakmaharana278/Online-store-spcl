import React, { useEffect, useState, useCallback } from "react";
import Layout from "../components/Layout";
import ProductCard from "./ProductCard";
import { fetchProducts } from "../services/api";
import FilterSidebar from "./FilterSidebar";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const Home = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
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
    setShowMobileFilters(false);
  };

  const handleSortChange = (ordering) => {
    setFilters({ ...filters, ordering });
  };

  const handleAddToCart = useCallback((product) => {
    // console.log("Home: Adding to cart:", product.name);
    if (onAddToCart) {
      onAddToCart(product);
      toast.success(`${product.name} added to cart!`);
    }
  }, [onAddToCart]);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.minRating) count++;
    return count;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="w-full bg-white rounded-lg shadow-md p-3 flex items-center justify-between hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-filter"></i>
              <span className="font-medium text-gray-700">Filters</span>
            </div>
            <div className="flex items-center gap-2">
              {getActiveFiltersCount() > 0 && (
                <span className="bg-amber-400 text-gray-950 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getActiveFiltersCount()}
                </span>
              )}
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block lg:w-1/4">
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
          </div>
        
          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <p className="text-gray-600 text-sm sm:text-base">
                  {products.length} <span className="hidden sm:inline">products</span> found
                </p>
                <select
                  value={filters.ordering}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm sm:text-base bg-white focus:outline-none focus:border-amber-400 w-full sm:w-auto"
                >
                  <option value="">Sort by: Featured</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-rating">Rating: High to Low</option>
                </select>
              </div>
            </div>
            

            {getActiveFiltersCount() > 0 && (
              <div className="lg:hidden flex flex-wrap gap-2 mb-4">
                {filters.category && (
                  <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    Category: {filters.category}
                    <button
                      onClick={() => handleFilterChange({ category: "" })}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    Price: {filters.minPrice || "0"} - {filters.maxPrice || "∞"}
                    <button
                      onClick={() => handleFilterChange({ minPrice: "", maxPrice: "" })}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                )}
                {filters.minRating && (
                  <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    Rating: {filters.minRating}+ ★
                    <button
                      onClick={() => handleFilterChange({ minRating: "" })}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                )}
                <button
                  onClick={() => handleFilterChange({
                    category: "",
                    minPrice: "",
                    maxPrice: "",
                    minRating: "",
                  })}
                  className="text-amber-600 text-xs hover:text-amber-700"
                >
                  Clear All
                </button>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
                <p className="text-gray-500 mt-2">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-gray-500">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
            /> 
            <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl overflow-y-auto animate-slide-in-right">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="p-4">
                <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
              </div>
              
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                <button
                  onClick={() => {
                    handleFilterChange({
                      category: "",
                      minPrice: "",
                      maxPrice: "",
                      minRating: "",
                    });
                    setShowMobileFilters(false);
                  }}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </Layout>
  );
};

export default Home;